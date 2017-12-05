import { Container, Texture, Sprite } from 'pixi.js';
import { Promise } from 'es6-promise';
import { getSizeFromString } from '@folklore/size';
import UserMedia from '@folklore/user-media';

class Camera extends Container {
    constructor(opts) {
        super();

        this.options = {
            width: window.innerWidth,
            height: window.innerHeight,
            size: 'cover',
            type: 'video',
            userMedia: null,
            ...opts,
        };

        this.onUserMediaStarted = this.onUserMediaStarted.bind(this);
        this.onUserMediaError = this.onUserMediaError.bind(this);
        this.onVideoLoadedMetadata = this.onVideoLoadedMetadata.bind(this);
        this.onTextureLoaded = this.onTextureLoaded.bind(this);

        this.started = false;
        this.cameraWidth = this.options.width;
        this.cameraHeight = this.options.height;
        this.video = null;
        this.texture = null;
        this.sprite = null;

        this.userMedia = this.options.userMedia || new UserMedia({
            type: this.options.type,
        });
        this.userMedia.on('started', this.onUserMediaStarted);
        this.userMedia.on('error', this.onUserMediaError);
    }

    onUserMediaStarted() {
        this.init();
    }

    onUserMediaError(err) {
        this.started = false;
        console.error(err);
    }

    onVideoLoadedMetadata() {
        this.texture.update();
        this.udpateSize();
    }

    onTextureLoaded() {
        this.udpateSize();
    }

    init() {
        const url = this.userMedia.getStreamUrl();
        this.video = this.createVideo(url);
        this.sprite = this.createSprite(this.video);
        this.texture = this.sprite.texture;
        this.addChild(this.sprite);
        this.udpateSize();
    }

    start() {
        if (this.started) {
            return Promise.resolve();
        }
        this.started = true;
        return this.userMedia.start();
    }

    stop() {
        if (!this.started) {
            return;
        }
        this.started = false;
        this.destroySprite();
        this.destroyVideo();
        this.userMedia.stop();
    }

    resize(width, height) {
        this.cameraWidth = width;
        this.cameraHeight = height;
        this.udpateSize();
    }

    update() {
        if (
            !this.started ||
            this.texture === null ||
            !this.texture.baseTexture.hasLoaded
        ) {
            return;
        }
        this.texture.update();
    }

    destroy() {
        this.stop();

        this.userMedia.destroy();

        this.destroySprite();

        this.destroyVideo();
    }

    getUserMedia() {
        return this.userMedia;
    }

    createVideo(url) {
        const video = document.createElement('video');
        video.src = url;
        video.autoplay = false;
        video.addEventListener('loadedmetadata', this.onVideoLoadedMetadata);
        video.load();
        return video;
    }

    destroyVideo() {
        if (this.video === null) {
            return;
        }
        this.video.removeEventListener('loadedmetadata', this.onVideoLoadedMetadata);
        this.video.pause();
        this.video.src = null;
        this.video = null;
    }

    createSprite(video) {
        const texture = Texture.fromVideo(video);
        texture.baseTexture.autoPlay = true;
        texture.baseTexture.autoUpdate = false;
        texture.baseTexture.on('loaded', this.onTextureLoaded);
        return new Sprite(texture);
    }

    destroySprite() {
        if (this.sprite !== null) {
            this.removeChild(this.sprite);
            this.sprite.destroy();
            this.sprite = null;
        }
        if (this.texture !== null) {
            this.texture.baseTexture.off('loaded', this.onTextureLoaded);
            this.texture.destroy(true);
            this.texture = null;
        }
    }

    udpateSize() {
        const { size } = this.options;
        if (
            this.sprite === null ||
            this.texture === null ||
            this.texture.baseTexture.width === 0 ||
            this.texture.baseTexture.height === 0
        ) {
            return;
        }
        const { width, height, scale } = getSizeFromString(
            size,
            this.texture.baseTexture.width,
            this.texture.baseTexture.height,
            this.cameraWidth,
            this.cameraHeight,
        );
        this.sprite.scale.set(scale, scale);
        this.sprite.position.set(
            Math.round((this.cameraWidth - width) / 2),
            Math.round((this.cameraHeight - height) / 2),
        );
    }
}

export default Camera;
