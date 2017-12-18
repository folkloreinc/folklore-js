import { Container, loaders, extras } from 'pixi.js';
import { TweenMax, Linear } from 'gsap';
import isArray from 'lodash/isArray';

class Movieclip extends Container {
    constructor(opts) {
        super();

        this.options = {
            spritesheets: [],
            frameRate: 16,
            paused: true,
            repeat: -1,
            easing: Linear.easeNone,
            duration: null,
            ...opts,
        };

        this.onTexturesLoaded = this.onTexturesLoaded.bind(this);
        this.onTweenUpdate = this.onTweenUpdate.bind(this);

        this.spritesheets = !isArray(this.option.spritesheets) ?
            [this.option.spritesheets] : this.option.spritesheets;
        this.textures = null;
        this.loader = new loaders.Loader();
        this.sprite = null;
        this.tween = this.createTween(0);
        this.progress = 0;
        this.loaded = false;

        this.loadSpritesheets();
    }

    onTweenUpdate() {
        const { totalFrames } = this.sprite;
        this.sprite.gotoAndStop(Math.round(this.progress * totalFrames));
    }

    onTexturesLoaded(loader, resources) {
        this.loaded = true;
        this.textures = this.spritesheets.reduce((textures, spritesheet) => (
            textures.concat(resources[spritesheet].textures)
        ), []);

        this.sprite = this.createSprite(this.textures);
        this.tween = this.createTween(this.sprite.totalFrames);
        this.addChild(this.sprite);

        this.emit('loaded');
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
