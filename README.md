# Token Audio

Allows for you to assign ambient sounds to tokens.

# Description

Token audio allows for you to use the default ambient sound workflow but with a twist! If you drag (or create) an ambient sound on top of a token, the ambient sound will follow along!

![Example.gif](Example/Example.gif)

## Note

For the time there are some minor restrictions/inconviences

1. Tokens can only have one audio source at a time, if you wish to replace an audio source you must delete it.
2. Audio sources can not be easily swapped at this time, if you wish to remove an audio source/replace it you must delete the ambient source and create a new one.
3. The GM user(s) must be connected for the tokens to move, as the GM is the only one with the ability to update ambientSounds.

### Usage

1. Create an ambient sound via the HUD on the left hand side.
2. Drag the ambient sound to the center of a token and watch as the ambient sound follows the token.

### Module Developers

If you'd like to call the functions within, the exposed API below may be useful

```
async TokenAudio.handleTokenAudio.placeAudio(tokenId, ambientId)

async TokenAudio.handleTokenAudio.releaseAudio(flagInfo : entity.data.flags)
// I.E pass the data.flags of the ambientsource or the token you're trying to release.
```
