# droid-preset-manager

Generates the config for a 15 preset x 16 CV/4 Gate eurorack module on the [Droid eurorack platform](https://shop.dermannmitdermaschine.de/pages/droid-universal-cv-processor).

This patch currently expects the following modules:

- 1 Droid Master
- 1 Droid X7
- 2 Droid P2B8
- 1 Midi to 8 CV Module
  - We're currently using the Expert Sleepers FH-2, but most options will work
  - Patch sends out CCs on CH16 CC 1-8

## Usage

### First Time Setup

```sh
fnm use # install node however you see fit
npm i   # install dependencies
```

### Creating a new build

1. Edit config in top of `src/build.ts` if necessary
2. Run build using npm: `npm run build`
3. Load `dist/generated.ini` into forge
4. If no errors show up, send to droid over usb using `Activate`