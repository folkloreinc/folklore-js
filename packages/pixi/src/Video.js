import { Container, Texture, Sprite } from 'pixi.js';
import { getSizeFromString } from '@folklore/size';

const videoIsPlaying = video => (
    video.currentTime > 0 &&
    !video.paused &&
    !video.ended &&
    video.readyState > 2
);

class Video extends Container {
    constructor(opts) {
        super();

        this.options = {
            width: window.innerWidth,
            height: window.innerHeight,
            size: 'cover',
            muted: true,
            autoplay: false,
            volume: 1,
            playsInline: true,
            ...opts,
        };

        this.onVideoLoadedMetadata = this.onVideoLoadedMetadata.bind(this);
        this.onVideoPlay = this.onVideoPlay.bind(this);
        this.onVideoPause = this.onVideoPause.bind(this);
        this.onVideoEnded = this.onVideoEnded.bind(this);
        this.onTextureLoaded = this.onTextureLoaded.bind(this);

        this.loaded = false;
        this.playing = false;
        this.containerWidth = this.options.width;
        this.containerHeight = this.options.height;
        this.video = null;
        this.videoOwner = false;
        this.texture = null;
        this.sprite = null;
    }

    onVideoLoadedMetadata() {
        this.texture.update();
        this.updateSize();
    }

    onVideoPlay() {
        this.playing = true;
    }

    onVideoPause() {
        this.playing = false;
    }

    onVideoEnded() {
        this.playing = false;
    }

    onTextureLoaded() {
        this.loaded = true;
        this.updateSize();
    }

    setVideoUrl(url) {
        const video = url !== null ? this.createVideo(url) : null;
        this.setVideo(video, true);
    }

    setVideo(video, owner) {
        if (video === null) {
            this.destroy();
        } else {
            this.videoOwner = owner || false;
            this.init(video);
        }
    }

    getVideo() {
        return this.video;
    }

    init(video) {
        this.destroy();
        this.video = this.initVideo(video);
        this.sprite = this.createSprite(this.video);
        this.texture = this.sprite.texture;
        this.addChild(this.sprite);
        this.updateSize();

        if (videoIsPlaying(this.video)) {
            this.playing = true;
        }
    }

    resize(width, height) {
        this.containerWidth = width;
        this.containerHeight = height;
        this.updateSize();
    }

    update() {
        if (!this.playing || !this.loaded) {
            return;
        }
        this.texture.update();
    }

    destroy() {
        this.loaded = false;
        this.destroySprite();
        this.destroyVideo();
    }

    createVideo(url) {
        const {
            volume,
            muted,
            autoplay,
            playsInline,
        } = this.options;
        const video = document.createElement('video');
        video.src = url;
        video.autoplay = autoplay;
        video.muted = muted;
        video.volume = volume;
        video.playsInline = playsInline;
        return video;
    }

    initVideo(video) {
        video.addEventListener('loadedmetadata', this.onVideoLoadedMetadata);
        video.addEventListener('play', this.onVideoPlay);
        video.addEventListener('paused', this.onVideoPause);
        video.addEventListener('ended', this.onVideoEnded);
        video.load();
        return video;
    }

    destroyVideo() {
        if (this.video === null) {
            return;
        }
        if (this.playing && this.videoOwner) {
            this.video.pause();
        }
        this.video.removeEventListener('loadedmetadata', this.onVideoLoadedMetadata);
        this.video.removeEventListener('play', this.onVideoPlay);
        this.video.removeEventListener('paused', this.onVideoPause);
        this.video.removeEventListener('ended', this.onVideoEnded);
        this.video = null;
    }

    createSprite(video) {
        const texture = Texture.fromVideo(video);
        texture.baseTexture.autoPlay = true;
        texture.baseTexture.autoUpdate = false;
        texture.baseTexture.on('loaded', this.onTextureLoaded);
        if (texture.baseTexture.hasLoaded) {
            this.onTextureLoaded();
        }
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

    updateSize() {
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
            this.containerWidth,
            this.containerHeight,
        );
        this.sprite.scale.set(scale, scale);
        this.sprite.position.set(
            Math.round((this.containerWidth - width) / 2),
            Math.round((this.containerHeight - height) / 2),
        );
    }
}

export default Video;
