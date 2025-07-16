import type { MusicControl } from "sound-deck";

interface Props {
    musicControl?: MusicControl;
    play: { (): void };
    beatNumber?: number;
    duration?: number;
}

export const PlayControls = ({ musicControl, play, beatNumber, duration }: Props) => {

    const stop = () => {
        if (!musicControl) {
            return
        }
        musicControl.stop()
    }

    const pause = () => {
        if (!musicControl) {
            return
        }
        if (musicControl.isPaused) {
            musicControl.resume()
        } else {
            musicControl.pause()
        }
    }

    const ratio = typeof beatNumber === 'number' && !!duration ? beatNumber / duration : undefined;

    return (
        <div css={{
            display: 'flex',
            gap: 5,
            alignItems: 'center',
            padding: 5,
            borderColor: 'red',
            borderStyle: 'outset',
            borderWidth: 1,
            borderRadius: 10,
        }}>
            <button disabled={!!musicControl} onClick={play}>play</button>
            <button disabled={!musicControl} onClick={pause}>pause</button>
            <button disabled={!musicControl} onClick={stop}>stop</button>
            <div>
                {!!ratio && (
                    <span>{(ratio*100).toFixed(2)} %</span>
                )}
            </div>
        </div>
    )
}