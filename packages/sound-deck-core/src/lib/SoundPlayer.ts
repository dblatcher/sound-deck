interface SoundPlayerElements {
    toggleButton?: HTMLElement
}

interface PlayOptions {
    volume?: number
}

export interface ToneConfigInput {
    frequency?: number
    endFrequency?: number
    duration?: number
    type?: OscillatorType
    volume?: number
}

export class ToneConfig implements ToneConfigInput {
    frequency: number
    endFrequency: number
    duration: number
    type: OscillatorType
    volume: number

    constructor(config: ToneConfigInput) {
        this.frequency = config.frequency || 440
        this.endFrequency = config.endFrequency || this.frequency
        this.duration = config.duration || 1
        this.type = config.type || 'sine'
        this.volume = config.volume || .1
    }
}

export class SoundPlayer {

    audioElements: Map<string, HTMLAudioElement>
    sources: Map<string, MediaElementAudioSourceNode>
    audioCtx?: AudioContext
    elements: SoundPlayerElements
    savedNoises: Map<string, ToneConfigInput>
    tonesPlaying: Map<string, OscillatorNode>

    constructor(sounds: Record<string, string | undefined>, elements: SoundPlayerElements = {}) {

        this.audioElements = new Map();
        this.sources = new Map();

        this.audioCtx = AudioContext ? new AudioContext() : undefined;
        this.elements = elements

        for (const soundName in sounds) {
            const audioElement = document.createElement('audio');
            audioElement.setAttribute('src', sounds[soundName] ?? '');
            audioElement.setAttribute('soundName', soundName);
            this.audioElements.set(soundName, audioElement);

            if (this.audioCtx) {
                this.sources.set(soundName, this.audioCtx.createMediaElementSource(audioElement));
                this.sources.get(soundName)?.connect(this.audioCtx.destination);
            }
        }

        if (this.elements.toggleButton) {

            if (this.audioCtx) {
                this.elements.toggleButton.setAttribute('data-sound-enabled', 'false');
                this.elements.toggleButton.addEventListener('click', this.toggle.bind(this))
            } else {
                this.elements.toggleButton.setAttribute('data-sound-enabled', 'true');
                this.elements.toggleButton.setAttribute('data-toggle-broken', 'true');
            }
        }

        this.tonesPlaying = new Map();
        this.savedNoises = new Map();
    }


    defineTone(name: string, configInput: ToneConfigInput) {
        this.savedNoises.set(name, configInput);
    }

    playTone(input: ToneConfigInput | string, label?: string) {
        if (!this.audioCtx) { return }

        let config: ToneConfig;

        if (typeof input == 'string') {
            const savedNoise: ToneConfigInput | undefined = this.savedNoises.get(input)
            if (!savedNoise) {
                console.warn(`no saved tone called ${input}`);
                return
            }
            config = new ToneConfig(savedNoise)
        } else {
            config = new ToneConfig(input as ToneConfigInput)
        }

        const tone = this.audioCtx.createOscillator()
        const gainNode = this.audioCtx.createGain()

        gainNode.gain.setValueAtTime(config.volume, this.audioCtx.currentTime)

        tone.frequency.setValueAtTime(config.frequency, this.audioCtx.currentTime);
        tone.frequency.linearRampToValueAtTime(config.endFrequency, this.audioCtx.currentTime + config.duration);
        tone.type = config.type;

        tone.connect(gainNode)
        gainNode.connect(this.audioCtx.destination)
        tone.start();
        tone.stop(this.audioCtx.currentTime + config.duration);

        if (label) {
            this.tonesPlaying.set(label, tone);
        }
        tone.onended = () => {
            if (label) { this.tonesPlaying.delete(label) }
            tone.disconnect();
            gainNode.disconnect();
        }
        return tone
    }

    stopTone(label: string) {
        const tone = this.tonesPlaying.get(label);
        if (!tone) { return }
        tone.stop();
    }

    play(soundName: string, options: PlayOptions = {}) {

        if (!this.isEnabled && !this.elements.toggleButton && !!this.audioCtx) {
            this.enable()
                .then(() => this.play(soundName, options))
                .catch((e) => { console.warn(e) });
        }

        if (this.isEnabled === false) { return }
        const audioElement = this.audioElements.get(soundName);
        if (!audioElement) { return }

        const { volume = 1 } = options
        if (volume >= 0 && volume <= 1) { audioElement.volume = volume }

        if (audioElement.paused) {
            audioElement.play();
        } else {
            audioElement.currentTime = 0;
        }
    }

    get isEnabled() {
        if (!this.audioCtx) { return undefined }
        return this.audioCtx.state == 'running';
    }

    toggle() {
        if (this.isEnabled === undefined) { return }
        if (this.isEnabled === false) { return this.enable() }
        if (this.isEnabled === true) { return this.disable() }

    }

    enable() {
        if (!this.audioCtx) { return Promise.resolve()}
        if (this.elements.toggleButton) {
            this.elements.toggleButton.setAttribute('data-sound-enabled', 'true');
        }
        return this.audioCtx.resume();
    }

    disable() {
        if (!this.audioCtx) { return }

        this.audioElements.forEach(element => {
            element.pause()
            element.currentTime = 0
        })

        if (this.elements.toggleButton) {
            this.elements.toggleButton.setAttribute('data-sound-enabled', 'false');
        }
        return this.audioCtx.suspend();
    }

}
