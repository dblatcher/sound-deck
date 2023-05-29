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
}

export interface NoiseParams {
    duration?: number
    frequency?: number
}


export class SoundDeck {

    audioCtx: AudioContext | undefined
    protected masterGain: GainNode | null
    protected volumeWhenNotMute: number
    audioElements: Map<string, HTMLAudioElement>
    sampleBuffers: Map<string, AudioBuffer>

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

    async defineSampleBuffer(name: string, src: string): Promise<boolean> {

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

    playSample(soundName: string, options: PlayOptions = {}): SoundControl | null {

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

    playNoise(params: NoiseParams = {}, options: PlayOptions = {}): SoundControl | null {
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

    playTone(params: ToneParams, options: PlayOptions = {}): SoundControl | null {
        const { audioCtx, masterGain } = this

        if (!audioCtx || !masterGain) { return null }

        const { loop = false, volume = 1 } = options;
        const { frequency = 1000, type = "sine", duration = 1 } = params;

        const endFrequency = params.endFrequency || frequency;

        const oscillatorNode = audioCtx.createOscillator()
        oscillatorNode.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        oscillatorNode.frequency.linearRampToValueAtTime(endFrequency, audioCtx.currentTime + duration);
        oscillatorNode.type = type;

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

    mute() {
        if (!this.masterGain) { return }
        this.volumeWhenNotMute = this.masterGain.gain.value;
        this.masterGain.gain.value = 0;
    }

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

    toggle() {
        if (this.isEnabled === undefined) { return Promise.resolve() }
        if (this.isEnabled === false) { return this.enable() }
        if (this.isEnabled === true) { return this.disable() }
    }

    enable() {
        if (!this.audioCtx) { return Promise.resolve() }
        return this.audioCtx.resume();
    }

    disable() {
        if (!this.audioCtx) { return Promise.resolve() }
        this.audioElements.forEach(element => {
            element.pause()
            element.currentTime = 0
        })
        return this.audioCtx.suspend();
    }

}
