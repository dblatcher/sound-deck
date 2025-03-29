# sound-deck-core

The SoundDeck class presents a convenient API for producing sounds in your client-side JS / TS projects. The SoundDeck uses the [AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) interface and abstracts some of the complexity of managing an audio graph.

Current features:

- load audio files from a URL then play and stop them on demand
- generate white noise of a given frequency using randomly generated sample buffers
- generate tones using Oscillator node
- set the master volume of the whole SoundDeck and/or set the volume of individual sounds when playing them
- define volume profiles for generated sound
- Promise - based API for knowing when a sound has finished
- ability to play sounds on a loop until programatically stoped.
- use preset sound configurations of configure your own


## installation

npm
`npm i sound-deck`

yarn
``yarn add sound-deck`

### Usage

Basic example:

```typescript
import { SoundDeck } from 'sound=deck';
const mySoundDeck = new SoundDeck();

console.log('starting 5 second tone');
const tone = mySoundDeck.playTone({
  type: 'sawtooth',
  frequency: 600,
  duration: 5,
  volume: 0.5,
});

if (tone) {
  tone.whenEnded.then(() => {
    console.log('tone now finished.');
  });
}
```

See more examples at:

- https://github.com/dblatcher/sound-deck/tree/main/packages/package-demo-app

## compatability

Most modern browsers are [compatible with AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext#browser_compatibility). 

The methods for loading and playing audio file have fallbacks to work partially in envirornements where the AudioContext is not available. However, the
`playNoise` and `playTone` methods will produce no sound and return `null`.

## Running unit tests

Run `nx test sound-deck-core` to execute the unit tests via [Jest](https://jestjs.io).

## Releases

- From sound-deck\packages\sound-deck-core : Use `npm version {patch|minor|major}` to update version number
- From sound-deck\ : `nx build sound-deck-core` to build the library.
- From sound-deck\dist\packages\sound-deck-core: `npm publish`
