import { Container, Texture, loaders, extras } from 'pixi.js';
import { TweenMax, Linear } from 'gsap';
import isArray from 'lodash/isArray';
import sortBy from 'lodash/sortBy';

class Movieclip extends Container {
    constructor(opts) {
        super();

        this.options = {
            spritesheets: [],
            frameRate: 16,
            paused: false,
            repeat: -1,
            easing: Linear.easeNone,
            duration: null,
            getTexturesFromResources: null,
            sortTexturesBy: null,
            ...opts,
        };

        this.onTexturesLoaded = this.onTexturesLoaded.bind(this);
        this.onTweenUpdate = this.onTweenUpdate.bind(this);

        const { spritesheets } = this.options;

        this.spritesheets = !isArray(spritesheets) ? [spritesheets] : spritesheets;
        this.textures = null;
        this.loader = new loaders.Loader();
        this.sprite = null;
        this.tween = this.createTween(0);
        this.progress = 0;
        this.loaded = false;

        this.loadSpritesheets();
    }

    onTweenUpdate() {
        if (this.sprite === null) {
            return;
        }
        const { totalFrames } = this.sprite;
        this.sprite.gotoAndStop(Math.round(this.progress * totalFrames));
    }

    onTexturesLoaded(loader, resources) {
        const { sortTexturesBy } = this.options;

        this.loaded = true;

        this.textures = this.getTexturesFromResources(this.spritesheets, resources);
        if (sortTexturesBy !== null) {
            this.textures = sortBy(this.textures, sortTexturesBy);
        }

        this.sprite = this.createSprite(this.textures);
        this.tween = this.createTween(this.sprite.totalFrames);
        this.addChild(this.sprite);

        this.emit('loaded');
    }

    getTexturesFromResources(spritesheets, resources) {
        const { getTexturesFromResources } = this.options;
        if (getTexturesFromResources !== null) {
            return getTexturesFromResources(spritesheets, resources);
        }
        return this.spritesheets.reduce((textures, spritesheet) => (
            textures.concat(Object.values(resources[spritesheet].textures))
        ), []);
    }

    loadSpritesheets() {
        this.spritesheets.forEach((spritesheet) => {
            this.loader.add(spritesheet);
        });
        this.loader.load(this.onTexturesLoaded);
    }

    // eslint-disable-next-line class-methods-use-this
    createSprite(textures) {
        return new extras.AnimatedSprite(textures);
    }

    createTween(totalFrames) {
        const {
            frameRate,
            repeat,
            paused,
            easing,
            duration,
        } = this.options;
        const tweenDuration = duration || (totalFrames / frameRate);
        return TweenMax.fromTo(this, tweenDuration, {
            progress: 0,
        }, {
            progress: 1,
            paused,
            repeat,
            ease: easing,
            onUpdate: this.onTweenUpdate,
        });
    }

    getSize() {
        if (this.textures === null) {
            return {
                width: 0,
                heigth: 0,
            };
        }
        const { width, height } = this.textures[0];
        return {
            width,
            height,
        };
    }

    getTween() {
        return this.tween;
    }

    play() {
        this.tween.paused(false);
    }

    pause() {
        this.tween.paused(true);
    }

    destroy() {
        if (this.loader !== null) {
            this.loader.destroy();
            this.loader = null;
        }

        if (this.sprite !== null) {
            this.sprite.destroy();
            this.sprite = null;
        }

        if (this.spritesheets !== null) {
            this.spritesheets.forEach((spritesheet) => {
                Texture.removeFromCache(`${spritesheet}_image`);
            });
        }

        if (this.textures !== null) {
            this.textures.forEach(texture => texture.destroy(true));
            this.textures = null;
        }

        if (this.tween !== null) {
            this.tween.kill();
            this.tween = null;
        }
    }
}

export default Movieclip;
