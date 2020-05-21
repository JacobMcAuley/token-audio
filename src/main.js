const TP = this.TP || {};

class TokenAudioInitializer {
    constructor() {}

    static initialize() {
        TokenAudioInitializer.hooksOnUpdateAmbientSound();
        TokenAudioInitializer.hooksOnCreateAmbientSound();
        TokenAudioInitializer.hooksOnUpdateToken();
        TokenAudioInitializer.hooksOnDelete();
        TP.handleTokenAudio = new HandleTokenAudio();
    }

    static hooksOnUpdateToken() {
        Hooks.on("updateToken", (scene, data, update, flags, sceneId) => {
            if (update.x || update.y) {
                TP.handleTokenAudio.moveAudio(data.x, data.y, data._id);
            }
        });
    }

    static hooksOnDelete() {
        Hooks.on("deleteToken", (scene, data, flags, sceneId) => {
            TP.handleTokenAudio.releaseAudio(data.flags);
        });

        Hooks.on("deleteAmbientSound", (scene, data, flags, sceneId) => {
            TP.handleTokenAudio.releaseAudio(data.flags);
        });
    }

    static hooksOnUpdateAmbientSound() {
        Hooks.on("updateAmbientSound", (scene, data, update, flags, sceneId) => {
            TP.handleTokenAudio.inTokenPosition(data.x, data.y, data._id);
        });
    }

    static hooksOnCreateAmbientSound() {
        Hooks.on("createAmbientSound", (scene, data, flags, sceneId) => {
            TP.handleTokenAudio.inTokenPosition(data.x, data.y, data._id);
        });
    }
}

class HandleTokenAudio {
    constructor() {}

    moveAudio(tokenX, tokenY, tokenId) {
        if (!this._hasAssociatedAudio(tokenId)) return;
        let token = canvas.tokens.get(tokenId);
        let ambientSound = canvas.sounds.get(token.getFlag("token-audio", "ambientId"));
        ambientSound.update({ x: tokenX + token.w / 2, y: tokenY + token.h / 2 });
    }

    inTokenPosition(audioX, audioY, ambientId) {
        let result = canvas.tokens.placeables.filter((token) => token.x + token.w / 2 == audioX && token.y + token.h / 2 == audioY);
        if (result.length <= 0) return;
        let selectedToken = result[0];
        this.placeAudio(selectedToken.id, ambientId);
    }

    async placeAudio(tokenId, ambientId) {
        if (this._hasAssociatedAudio(tokenId) || this._hasAssociatedToken(ambientId)) return;
        let token = canvas.tokens.get(tokenId);
        let ambientSound = canvas.sounds.get(ambientId);

        await token.setFlag("token-audio", "ambientId", ambientId);
        await ambientSound.setFlag("token-audio", "tokenId", tokenId);
    }

    releaseAudio(flagInfo = {}) {
        let ambientId = getProperty(flagInfo, "token-audio.ambientId"); // Deleting a token
        let tokenId = getProperty(flagInfo, "token-audio.tokenId"); // Deleting an ambient source

        if (ambientId) {
            let ambientSound = canvas.sounds.get(ambientId);
            ambientSound.unsetFlag("token-audio", "tokenId");
        }

        if (tokenId) {
            let token = canvas.tokens.get(tokenId);
            token.unsetFlag("token-audio", "ambientId");
        }
    }

    _hasAssociatedToken(ambientId) {
        let soundId = canvas.sounds.get(ambientId);
        if (!soundId) return;
        try {
            let tokenId = soundId.getFlag("token-audio", "tokenId");
            return tokenId || false;
        } catch {
            return false;
        }
    }

    _hasAssociatedAudio(tokenId) {
        let token = canvas.tokens.get(tokenId);
        if (!token) return;
        try {
            let ambientSound = token.getFlag("token-audio", "ambientId");
            return ambientSound || false;
        } catch {
            return false;
        }
    }
}

TokenAudioInitializer.initialize();
