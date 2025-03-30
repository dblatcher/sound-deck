import { AbstractSoundDeck } from "./AbstractSoundDeck"
import { tone439HzDataUrl } from "./fallback-tone"
import { fallbackWhiteNoise } from "./fallback-whitenoise"
import { NoiseConfig, PlayOptions, ToneConfig } from "./input-types"
import { SoundControl } from "./SoundControl"



/**
 * A class that presents a convenient API for producing sounds.
 * 
 * Intended for browsers that do not support Audio context. Provides
 * imperfect implementations of the SoundDeck's methods
 */
export class LegacySoundDeck extends AbstractSoundDeck {


    protected currentVolume: number
    protected enabled: boolean
    audioElements: Map<string, HTMLAudioElement>
    fallbackToneAudioElement: HTMLAudioElement
    fallbackNoiseAudioElement: HTMLAudioElement

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
        super()
        this.audioElements = new Map();
        this.volumeWhenNotMute = 1;
        this.currentVolume = 1;
        this.enabled = true

        const fallbackToneAudioElement = document.createElement('audio');
        fallbackToneAudioElement.src = tone439HzDataUrl;
        this.fallbackToneAudioElement = fallbackToneAudioElement

        const fallbackNoiseAudioElement = document.createElement('audio');
        fallbackNoiseAudioElement.src = fallbackWhiteNoise;
        this.fallbackNoiseAudioElement = fallbackNoiseAudioElement;

    }

    async defineSampleBuffer(
        /** the name used to access to sample in calls to `playSample` */
        name: string,
        /** the URL of the audio file to be loaded*/
        src: string
    ): Promise<boolean> {

        const { audioElements, } = this
        const audioElement = document.createElement('audio');
        audioElement.setAttribute('src', src);
        audioElement.setAttribute('soundName', name);

        return new Promise(resolve => {
            audioElement.addEventListener('canplay', () => {
                audioElements.set(name, audioElement);
                return resolve(true)
            }, { once: true })
            audioElement.addEventListener('error', () => {
                return resolve(false)
            }, { once: true })
        })

    }

    defineCustomWaveForm(): PeriodicWave | undefined {
        return undefined
    }

    playSample(
        /** the name assigned to sample in a prior call to `defineSampleBuffer`*/
        soundName: string,
        /** the options for this particular playing of the sample. */
        options: PlayOptions = {}
    ): SoundControl | null {

        if (!this.isEnabled) {
            return null
        }

        const audioElement = this.audioElements.get(soundName);
        if (!audioElement) { return null }

        const { volume = 1 } = options
        if (volume >= 0 && volume <= 1) { audioElement.volume = volume * this.masterVolume }

        if (audioElement.paused) {
            audioElement.play();
        } else {
            audioElement.currentTime = 0;
        }

        return new SoundControl(audioElement)
    }

    private playFallbackSample(
        config: NoiseConfig = {},
        type: 'noise' | 'tone'
    ): SoundControl {
        const audioElement = type === 'tone' ? this.fallbackToneAudioElement : this.fallbackNoiseAudioElement
        const { volume = 1, duration = 1 } = config
        const requiredRate = audioElement.duration / duration;
        const rateWithinLimits = Math.max(Math.min(4, requiredRate), .5)
        audioElement.playbackRate = rateWithinLimits
        // TO DO - combine with masterVolume somehow
        if (volume >= 0 && volume <= 1) { audioElement.volume = volume * this.masterVolume }

        if (audioElement.paused) {
            audioElement.play();
        } else {
            audioElement.currentTime = 0;
        }

        return new SoundControl(audioElement)
    }

    playNoise(
        config: NoiseConfig = {},
    ): SoundControl | null {
        if (!this.isEnabled) {
            return null
        }
        return this.playFallbackSample(config, 'noise')
    }

    playTone(
        config: ToneConfig
    ): SoundControl | null {
        if (!this.isEnabled) {
            return null
        }
        return this.playFallbackSample(config, 'tone')
    }


    get isEnabled() {
        return this.enabled
    }

    /**Set the masterGain for the SoundDeck to 0. */
    mute() {
        this.volumeWhenNotMute = this.currentVolume
        this.currentVolume = 0;
    }

    /**Restore the masterGain for the SoundDeck the value is was before the call to mute. */
    unmute() {
        this.currentVolume = this.volumeWhenNotMute;
    }

    get isMuted() {
        return this.currentVolume === 0
    }

    get masterVolume() {
        return this.currentVolume
    }

    set masterVolume(value: number) {
        this.currentVolume = value;
        this.volumeWhenNotMute = value;
    }

    get masterVolumnIfNotMuted() {
        return this.volumeWhenNotMute
    }

    enable() {
        this.enabled = true
        return Promise.resolve()
    }

    disable() {
        this.audioElements.forEach(element => {
            element.pause()
            element.currentTime = 0
        })
        this.enabled = false
        return Promise.resolve()
    }

}
