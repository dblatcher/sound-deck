import { NoiseConfig, PlayOptions, ToneConfig } from "./input-types"
import { SoundControl } from "./SoundControl"


export abstract class AbstractSoundDeck {
    customWaveforms: Map<string, PeriodicWave> = new Map()
    protected volumeWhenNotMute = 1;

    /**
      * Loads an audio file and assigns it a name, making it available to be
      * played by the `SoundDeck`.
      * 
      * Returns a promise resolving to whether the sample creation was successful
      */
    abstract defineSampleBuffer(
        /** the name used to access to sample in calls to `playSample` */
        name: string,
        /** the URL of the audio file to be loaded*/
        src: string
    ): Promise<boolean>


    /**
     * Store a custom waveform that can then be used with the `playTone` method, if the oeration succeeds
     * 
     * returns the PeriodicWave or `undefined` if the operation fails or is not supported.
     */
    abstract defineCustomWaveForm(name: string, real: Float32Array, imag: Float32Array): PeriodicWave | undefined

    /**
     * Play a sample previously loaded into the SoundDeck.
     * 
     * Returns a `SoundControl` representing the playing of the sample or null if the 
     * command fails.
     * 
     * If used in an enviroment without the AudioContext, the sample can play, but the function
     * will return null.
     */
    abstract playSample(
        /** the name assigned to sample in a prior call to `defineSampleBuffer`*/
        soundName: string,
        /** the options for this particular playing of the sample. */
        options?: PlayOptions
    ): SoundControl | null

    /**
     * Produce a randomly generated noise with the given parameters.
     * 
     * Returns a `SoundControl` representing the noise or null if the 
     * command fails
     */
    abstract playNoise(
        config?: NoiseConfig,
    ): SoundControl | null

    /**
     * Produce a tone with the given parameters.
     * 
     * Returns a `SoundControl` representing the tone or null if the 
     * command fails
     */
    abstract playTone(
        config: ToneConfig
    ): SoundControl | null

    abstract get isEnabled(): boolean



    /**Set the masterGain for the SoundDeck to 0. */
    abstract mute(): void

    /**Restore the masterGain for the SoundDeck the value is was before the call to mute. */
    abstract unmute(): void

    abstract get isMuted(): boolean;

    abstract get masterVolume(): number

    abstract set masterVolume(value: number)

    abstract get masterVolumnIfNotMuted(): number

    /** Toggle the SoundDeck between 'enabled' and 'disabled'. */
    toggle(): Promise<void> {
        return this.isEnabled ? this.disable() : this.enable()
    }

    /** 
     * Resume the SoundDeck's audio context, allowing any sounds to be produced.
     */
    abstract enable(): Promise<void>

    /** 
     * Suspend the SoundDeck's audio context, preventing any sounds being produced until it 
     * is resumed with the `enable` or `toggle`
     */
    abstract disable(): Promise<void>
}
