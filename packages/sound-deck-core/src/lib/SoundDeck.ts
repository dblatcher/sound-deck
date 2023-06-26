import { SoundControl } from "./SoundControl"


export interface PlayOptions {
    volume?: number
    loop?: boolean
}

export interface ToneParams {
    frequency?: number
    endFrequency?: number
    type?: OscillatorType
    duration?: number
    periodicWave?: PeriodicWave
}

export interface NoiseParams {
    duration?: number
    frequency?: number
}

/**
 * A class that presents a convenient API for producing sounds.
 * 
 * Uses the AudioContext interface. Some features have a fallback to
 * work in envirornements where the AudioContext is not available.
 */
export class SoundDeck {

    audioCtx: AudioContext | undefined
    protected masterGain: GainNode | null
    protected volumeWhenNotMute: number
    audioElements: Map<string, HTMLAudioElement>
    sampleBuffers: Map<string, AudioBuffer>

    /** 
     * Note that the AudioContext for the SoundDeck may start in a 'suspended' state 
     * depening on the policy of the browser.
     * 
     * E.G. on chrome, an AudioContext cannot resume before the user has interacted with the document.
     * https://developer.chrome.com/blog/autoplay/
     * 
     * It may be necessary to call `SoundDeck.enable` to resume the AudioContext 
     * before sounds can be played. You **can** do this by attaching event listeners to the document
     * to enable sound as soon as the user interacts in a relevant way, **but** it may be better to
     * add an explicit "enable sound" button so the user can decide it they want sound or not.
    */
    constructor() {
        this.audioCtx = AudioContext ? new AudioContext() : undefined;
        this.audioElements = new Map();
        this.sampleBuffers = new Map();
        this.volumeWhenNotMute = 1;

        if (this.audioCtx) {
            this.masterGain = this.audioCtx.createGain();
            this.masterGain.connect(this.audioCtx.destination)
        } else {
            this.masterGain = null
        }

        this.makeNoiseSourceNodeAndFilter = this.makeNoiseSourceNodeAndFilter.bind(this)
        this.loadAudioBuffer = this.loadAudioBuffer.bind(this)
    }

    private async loadAudioBuffer(src: string): Promise<AudioBuffer | null> {

        let audioBuffer: AudioBuffer;
        if (!this.audioCtx) { return null }

        try {
            const response = await fetch(src);
            const blob = await response.blob();
            const arraybuffer = await blob.arrayBuffer();
            audioBuffer = await this.audioCtx.decodeAudioData(arraybuffer)
        } catch (error) {
            console.warn(error);
            return null
        }
        return audioBuffer
    }

    /**
     * Loads an audio file and assigns it a name, making it available to be
     * played by the `SoundDeck`.
     * 
     * Returns a promise resolving to whether the sample creation was successful
     */
    async defineSampleBuffer(
        /** the name used to access to sample in calls to `playSample` */
        name: string,
        /** the URL of the audio file to be loaded*/
        src: string
    ): Promise<boolean> {

        const { loadAudioBuffer, audioElements, sampleBuffers, audioCtx } = this

        if (!audioCtx) {
            const audioElement = document.createElement('audio');
            audioElement.setAttribute('src', src);
            audioElement.setAttribute('soundName', name);
            audioElements.set(name, audioElement);
            return true
        }

        const audioBuffer = await loadAudioBuffer(src);
        if (!audioBuffer) { return false }

        sampleBuffers.set(name, audioBuffer);
        return true;
    }

    private playSampleWithoutContext(soundName: string, options: PlayOptions = {}): SoundControl | null {
        const audioElement = this.audioElements.get(soundName);
        if (!audioElement) { return null }

        const { volume = 1 } = options
        if (volume >= 0 && volume <= 1) { audioElement.volume = volume }

        if (audioElement.paused) {
            audioElement.play();
        } else {
            audioElement.currentTime = 0;
        }

        return new SoundControl(audioElement)
    }

    /**
     * Play a sample previously loaded into the SoundDeck.
     * 
     * Returns a `SoundControl` representing the playing of the sample or null if the 
     * command fails.
     * 
     * If used in an enviroment without the AudioContext, the sample can play, but the function
     * will return null.
     */
    playSample(
        /** the name assigned to sample in a prior call to `defineSampleBuffer`*/
        soundName: string,
        /** the options for this particular playing of the sample. */
        options: PlayOptions = {}
    ): SoundControl | null {

        const { audioCtx, sampleBuffers, masterGain } = this

        if (!audioCtx || !masterGain) {
            this.playSampleWithoutContext(soundName, options)
            return null
        }

        if (this.isEnabled === false) { return null }
        if (!sampleBuffers.has(soundName)) { return null }

        const audioBuffer = sampleBuffers.get(soundName);
        const gainNode = audioCtx.createGain()
        const sourceNode = audioCtx.createBufferSource();
        sourceNode.buffer = audioBuffer ?? null;

        const { loop = false, volume = 1 } = options;

        gainNode.gain.value = volume;
        sourceNode.loop = loop

        sourceNode.connect(gainNode).connect(masterGain)
        sourceNode.start()
        return new SoundControl(sourceNode, gainNode);
    }

    private makeNoiseSourceNodeAndFilter(params: NoiseParams): [AudioBufferSourceNode, BiquadFilterNode] | [null, null] {
        const { audioCtx } = this
        if (!audioCtx) { return [null, null] }
        const { duration = 1, frequency = 1000 } = params;
        const bufferSize = audioCtx.sampleRate * duration; // set the time of the note
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate); // create an empty buffer
        const data = buffer.getChannelData(0); // get data

        // fill the buffer with noise
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        // create a buffer source for our created data
        const noiseNode = audioCtx.createBufferSource();
        noiseNode.buffer = buffer;

        const bandpass = audioCtx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = frequency

        return [noiseNode, bandpass]
    }

    /**
     * Produce a randomly generated noise with the given parameters.
     * 
     * Returns a `SoundControl` representing the noise or null if the 
     * command fails
     */
    playNoise(
        /**the paramters describing the noise to produce */
        params: NoiseParams = {},
        /** the options for playing the noise*/
        options: PlayOptions = {}
    ): SoundControl | null {
        const { audioCtx, masterGain } = this
        if (!audioCtx || !masterGain) { return null }

        const { loop = false, volume = 1 } = options;
        const gainNode = audioCtx.createGain()
        const [noiseNode, bandpass] = this.makeNoiseSourceNodeAndFilter(params)
        if (!noiseNode || !bandpass) { return null }

        noiseNode.connect(bandpass).connect(gainNode).connect(masterGain);

        gainNode.gain.setValueAtTime(volume, audioCtx.currentTime)
        noiseNode.loop = loop;
        noiseNode.start(0);

        return new SoundControl(noiseNode, gainNode);
    }

    /**
     * Produce a tone with the given parameters.
     * 
     * Returns a `SoundControl` representing the tone or null if the 
     * command fails
     */
    playTone(
        /**the paramters describing the tone to produce */
        params: ToneParams,
        /** the options for playing the tone*/
        options: PlayOptions = {}
    ): SoundControl | null {
        const { audioCtx, masterGain } = this

        if (!audioCtx || !masterGain) { return null }

        const { loop = false, volume = 1 } = options;
        const { frequency = 1000, type = "sine", duration = 1, periodicWave } = params;
        const endFrequency = params.endFrequency || frequency;

        const oscillatorNode = audioCtx.createOscillator()
        if (periodicWave) {
            oscillatorNode.setPeriodicWave(periodicWave)
        } else {
            oscillatorNode.type = type === 'custom' ? 'sine' : type;
        }
        oscillatorNode.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        oscillatorNode.frequency.linearRampToValueAtTime(endFrequency, audioCtx.currentTime + duration);

        const gainNode = audioCtx.createGain()
        gainNode.gain.setValueAtTime(volume, audioCtx.currentTime)

        oscillatorNode.connect(gainNode).connect(masterGain);
        oscillatorNode.start();
        if (!loop) {
            oscillatorNode.stop(audioCtx.currentTime + duration);
        }

        return new SoundControl(oscillatorNode, gainNode);
    }


    get isEnabled() {
        if (!this.audioCtx) { return undefined }
        return this.audioCtx.state == 'running';
    }

    /**Set the masterGain for the SoundDeck to 0. */
    mute() {
        if (!this.masterGain) { return }
        this.volumeWhenNotMute = this.masterGain.gain.value;
        this.masterGain.gain.value = 0;
    }

    /**Restore the masterGain for the SoundDeck the value is was before the call to mute. */
    unmute() {
        if (!this.masterGain) { return }
        this.masterGain.gain.value = this.volumeWhenNotMute;
    }

    get isMuted() {
        if (!this.masterGain) { return false }
        return this.masterGain.gain.value === 0
    }

    get masterVolume() {
        if (!this.masterGain) { return 0 }
        return this.masterGain.gain.value
    }

    set masterVolume(value: number) {
        if (!this.masterGain) { return }
        this.masterGain.gain.value = value;
        this.volumeWhenNotMute = value;
    }

    get masterVolumnIfNotMuted() {
        return this.volumeWhenNotMute
    }

    /** Toggle the SoundDeck between 'enabled' and 'disabled'. */
    toggle() {
        if (this.isEnabled === undefined) { return Promise.resolve() }
        if (this.isEnabled === false) { return this.enable() }
        if (this.isEnabled === true) { return this.disable() }
    }

    /** 
     * Resume the SoundDeck's audio context, allowing any sounds to be produced.
     */
    enable() {
        if (!this.audioCtx) { return Promise.resolve() }
        return this.audioCtx.resume();
    }

    /** 
     * Suspend the SoundDeck's audio context, preventing any sounds being produced until it 
     * is resumed with the `enable` or `toggle`
     */
    disable() {
        if (!this.audioCtx) { return Promise.resolve() }
        this.audioElements.forEach(element => {
            element.pause()
            element.currentTime = 0
        })
        return this.audioCtx.suspend();
    }

}
