# droid-preset-manager

Generates the config for a 15 preset x 16 CV/4 Gate eurorack module on the [Droid eurorack platform](https://shop.dermannmitdermaschine.de/pages/droid-universal-cv-processor).

This patch currently expects the following modules:

- 1 Droid Master
- 1 Droid X7
- 2 Droid P2B8
- 1 Midi to 8 CV Module
  - I'm currently using the Expert Sleepers FH-2, but most options will work

## Usage

```sh
# if using fnm
fnm use

npm i

npm run build
```