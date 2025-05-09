import { AbstractSoundDeck } from "./AbstractSoundDeck"
import { NoiseConfig, PlayOptions, ToneConfig } from "./input-types"
import { SoundControl } from "./SoundControl"



/**
 * A class that presents a convenient API for producing sounds.
 * 
 * Uses the AudioContext interface. Some features have a fallback to
 * work in envirornements where the AudioContext is not available.
 */
export class SoundDeck extends AbstractSoundDeck {

    audioCtx: AudioContext
    protected masterGain: GainNode
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
    constructor(audioCtx?: AudioContext, startEnabled = false) {
        super()
        this.audioCtx = audioCtx ?? new AudioContext();
        this.sampleBuffers = new Map();
        this.customWaveforms = new Map();
        this.volumeWhenNotMute = 1;

        this.masterGain = this.audioCtx.createGain();
        this.masterGain.connect(this.audioCtx.destination)

        this.makeNoiseSourceNodeAndFilter = this.makeNoiseSourceNodeAndFilter.bind(this)
        this.loadAudioBuffer = this.loadAudioBuffer.bind(this)
        if (startEnabled) {
            console.log('initial resume')
            this.audioCtx.resume()
        }
    }

    private async loadAudioBuffer(src: string): Promise<AudioBuffer | null> {

        let audioBuffer: AudioBuffer;

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

    async defineSampleBuffer(
        /** the name used to access to sample in calls to `playSample` */
        name: string,
        /** the URL of the audio file to be loaded*/
        src: string
    ): Promise<boolean> {

        const { loadAudioBuffer, sampleBuffers } = this

        const audioBuffer = await loadAudioBuffer(src);
        if (!audioBuffer) { return false }

        sampleBuffers.set(name, audioBuffer);
        return true;
    }

    defineCustomWaveForm(name: string, real: Float32Array, imag: Float32Array): PeriodicWave | undefined {
        const { audioCtx, customWaveforms } = this
        if (real.length !== imag.length) {
            return undefined
        }

        const waveform = audioCtx.createPeriodicWave(real, imag)
        customWaveforms.set(name, waveform)
        return waveform
    }

    playSample(
        /** the name assigned to sample in a prior call to `defineSampleBuffer`*/
        soundName: string,
        /** the options for this particular playing of the sample. */
        options: PlayOptions = {}
    ): SoundControl | null {
        const { audioCtx, sampleBuffers, masterGain } = this
        if (this.isEnabled === false) { return null }

        const audioBuffer = sampleBuffers.get(soundName);
        if (!audioBuffer) { return null }
        const sourceNode = audioCtx.createBufferSource();
        sourceNode.buffer = audioBuffer;

        const gainNode = this.makeGainWithPattern(audioCtx, audioBuffer.duration, options)
        sourceNode.loop = options.loop ?? false;

        sourceNode.connect(gainNode).connect(masterGain)
        sourceNode.start()
        return new SoundControl(sourceNode, gainNode);
    }

    private makeNoiseSourceNodeAndFilter(config: NoiseConfig): [AudioBufferSourceNode, BiquadFilterNode] {
        const { audioCtx } = this
        const { duration = 1, frequency = 1000, endFrequency = frequency } = config;
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
        bandpass.frequency.exponentialRampToValueAtTime(endFrequency, audioCtx.currentTime + duration)

        return [noiseNode, bandpass]
    }

    private makeGainWithPattern(audioCtx: AudioContext, duration: number, { volume = 1, playPattern = [] }: PlayOptions) {
        const gainNode = audioCtx.createGain()
        gainNode.gain.setValueAtTime(volume, audioCtx.currentTime)
        playPattern.forEach(({ time: time, vol }) => {
            if (time < 0 || time > 1) {
                return
            }
            if (vol <= 0) {
                vol = 0.0001
            }
            const timeAt = audioCtx.currentTime + (time * (duration ?? 1))
            const adjustedVolume = vol * volume
            gainNode.gain.exponentialRampToValueAtTime(adjustedVolume, timeAt)
        })
        return gainNode
    }

    playNoise(
        config: NoiseConfig = {},
    ): SoundControl | null {
        const { audioCtx, masterGain } = this
        if (this.isEnabled === false) { return null }
        const [noiseNode, bandpass] = this.makeNoiseSourceNodeAndFilter(config)

        const gainNode = this.makeGainWithPattern(audioCtx, config.duration ?? 1, config)
        noiseNode.connect(bandpass).connect(gainNode).connect(masterGain);
        noiseNode.loop = config.loop ?? false;
        noiseNode.start(0);
        return new SoundControl(noiseNode, gainNode);
    }

    playTone(
        config: ToneConfig
    ): SoundControl | null {
        const { audioCtx, masterGain, customWaveforms } = this
        if (this.isEnabled === false) { return null }

        const { frequency = 1000, type = "sine", duration = 1, periodicWave, customWaveName } = config;
        const endFrequency = config.endFrequency || frequency;

        const oscillatorNode = audioCtx.createOscillator()

        if (periodicWave) {
            oscillatorNode.setPeriodicWave(periodicWave)
        } else if (customWaveName && customWaveforms.has(customWaveName)) {
            const wave = customWaveforms.get(customWaveName)
            if (wave) {
                oscillatorNode.setPeriodicWave(wave)
            }
        } else {
            oscillatorNode.type = type === 'custom' ? 'sine' : type;
        }
        oscillatorNode.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        oscillatorNode.frequency.linearRampToValueAtTime(endFrequency, audioCtx.currentTime + duration);

        const gainNode = this.makeGainWithPattern(audioCtx, config.duration ?? 1, config)

        oscillatorNode.connect(gainNode).connect(masterGain);
        oscillatorNode.start();
        if (!config.loop) {
            oscillatorNode.stop(audioCtx.currentTime + duration);
        }

        return new SoundControl(oscillatorNode, gainNode);
    }


    get isEnabled() {
        return this.audioCtx.state == 'running';
    }

    /**Set the masterGain for the SoundDeck to 0. */
    mute() {
        this.volumeWhenNotMute = this.masterGain.gain.value;
        this.masterGain.gain.value = 0;
    }

    /**Restore the masterGain for the SoundDeck the value is was before the call to mute. */
    unmute() {
        this.masterGain.gain.value = this.volumeWhenNotMute;
    }

    get isMuted() {
        return this.masterGain.gain.value === 0
    }

    get masterVolume() {
        return this.masterGain.gain.value
    }

    set masterVolume(value: number) {
        this.masterGain.gain.value = value;
        this.volumeWhenNotMute = value;
    }

    get masterVolumnIfNotMuted() {
        return this.volumeWhenNotMute
    }

    /** 
     * Resume the SoundDeck's audio context, allowing any sounds to be produced.
     */
    enable() {
        return this.audioCtx.resume().then(() => this);
    }

    /** 
     * Suspend the SoundDeck's audio context, preventing any sounds being produced until it 
     * is resumed with the `enable` or `toggle`
     */
    disable() {
        return this.audioCtx.suspend().then(() => this);
    }
}
