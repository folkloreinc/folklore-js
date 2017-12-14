import { Container, Graphics } from 'pixi.js';
import Color from 'color';

class Audio extends Container {
    constructor(opts) {
        super();

        this.options = {
            width: window.innerWidth,
            height: window.innerHeight,
            type: 'audio',
            fftSize: 256,
            smoothingTimeConstant: 0.2,
            barWidth: 2,
            barMargin: 1,
            barColor: 0xCCCCCC,
            barMinHeight: 10,
            activeWidthRatio: 0.7,
            ...opts,
        };

        this.onAudioProcess = this.onAudioProcess.bind(this);
        this.onTextureLoaded = this.onTextureLoaded.bind(this);

        this.started = false;
        this.cameraWidth = this.options.width;
        this.cameraHeight = this.options.height;
        this.audioContext = null;
        this.audio = null;
        this.analyser = null;
        this.analyserData = null;
        this.processor = null;
        this.bars = null;
        this.barsContainer = null;
        this.volume = 0;
    }

    onAudioProcess() {
        this.analyser.getByteFrequencyData(this.analyserData);
        const count = this.analyserData.length;
        let rms = 0;
        for (let i = 0; i < count; i += 1) {
            rms += this.analyserData[i] * this.analyserData[i];
        }
        rms /= count;
        rms = Math.sqrt(rms);
        this.volume = rms;
    }

    onTextureLoaded() {
        this.udpateSize();
    }

    setAudioStream(stream) {
        if (this.audioContext === null) {
            this.audioContext = this.createAudioContext();
        }
        const audio = stream !== null ?
            this.audioContext.createMediaStreamSource(stream) : null;
        this.setAudioNode(audio);
    }

    setAudioNode(audio) {
        if (audio === null) {
            this.destroy();
        } else {
            this.init(audio);
        }
    }

    init(audio) {
        this.initAudio(audio);
        this.initBars();
    }

    initAudio(audio) {
        this.destroyAudio();

        if (this.audioContext === null) {
            this.audioContext = this.createAudioContext();
        }

        this.analyser = this.createAnalyser();
        this.analyserData = new Uint8Array(this.analyser.frequencyBinCount);

        this.processor = this.createProcessor();

        this.audio = audio;
        this.audio.connect(this.analyser);
        this.analyser.connect(this.processor);
        this.processor.connect(this.audioContext.destination);
    }

    initBars() {
        this.destroyBars();

        this.barsContainer = new Container();
        this.bars = this.createBars(this.barsContainer);
        this.addChild(this.barsContainer);

        this.udpateSize();
    }

    resize(width, height) {
        this.cameraWidth = width;
        this.cameraHeight = height;
        this.udpateSize();
    }

    update() {
        if (this.audio === null) {
            return;
        }

        const {
            activeWidthRatio,
            barMinHeight,
        } = this.options;

        const currentBarsCount = this.bars.length;
        const activeCount = Math.ceil(currentBarsCount * activeWidthRatio);
        for (let i = 0; i < currentBarsCount; i += 1) {
            const bar = this.bars[i];
            let volume = 0;
            if (i < activeCount) {
                volume = i === activeCount - 1 ? this.volume : this.bars[i + 1].volume;
            }
            const barHeight = Math.max((volume / 256) * this.cameraHeight, barMinHeight);
            bar.volume = volume;
            bar.scale.y = barHeight;
            bar.position.y = (this.cameraHeight / 2) - (barHeight / 2);
        }
    }

    destroy() {
        this.destroyBars();

        this.destroyAudio();

        if (this.audioContext !== null) {
            this.audioContext.close();
            this.audioContext = null;
        }
    }

    // eslint-disable-next-line class-methods-use-this
    createAudioContext() {
        return new (window.AudioContext || window.webkitAudioContext)();
    }

    createAnalyser() {
        const { fftSize, smoothingTimeConstant } = this.options;
        const analyser = this.audioContext.createAnalyser();
        analyser.smoothingTimeConstant = smoothingTimeConstant;
        analyser.fftSize = fftSize;
        return analyser;
    }

    createProcessor() {
        const { fftSize } = this.options;
        const processor = this.audioContext.createScriptProcessor(fftSize * 2, 1, 1);
        processor.onaudioprocess = this.onAudioProcess;
        return processor;
    }

    createBars(container, bars) {
        const {
            barWidth,
            barMargin,
            barMinHeight,
        } = this.options;

        const currentBars = bars || [];
        const barTotalWidth = barWidth + barMargin;
        const barsCount = Math.ceil(this.cameraWidth / barTotalWidth);
        const currentBarsCount = currentBars.length;
        const maxCount = Math.max(currentBarsCount, barsCount);
        const maxIndex = barsCount - 1;
        const newBars = [];
        for (let i = 0; i < maxCount; i += 1) {
            if (i > maxIndex) {
                container.removeChild(currentBars[i]);
            } else {
                const barExists = typeof currentBars[i] !== 'undefined';
                const bar = barExists ? currentBars[i] : this.createBar();
                bar.position.x = i * barTotalWidth;
                newBars.push(bar);
                if (!barExists) {
                    bar.scale.y = barMinHeight;
                    bar.position.y = (this.cameraHeight / 2) - (barMinHeight / 2);
                    container.addChild(bar);
                }
            }
        }
        return newBars;
    }

    createBar(volume) {
        const { barWidth, barColor } = this.options;
        const graphics = new Graphics();
        const color = new Color(barColor);
        graphics.beginFill(color.rgbNumber(), 1);
        graphics.drawRect(0, 0, barWidth, 1);
        graphics.endFill();
        graphics.volume = volume || 0;
        return graphics;
    }

    destroyAudio() {
        if (this.processor !== null) {
            this.processor.onaudioprocess = null;
            this.processor.disconnect();
            this.processor = null;
        }

        if (this.audio !== null) {
            this.audio.disconnect();
            this.audio = null;
        }

        if (this.analyser !== null) {
            this.analyser.disconnect();
            this.analyser = null;
        }
    }

    destroyBars() {
        if (this.bars !== null) {
            this.bars.forEach((bar) => {
                bar.destroy();
                this.barsContainer.removeChild(bar);
            });
            this.bars = null;
        }

        if (this.barsContainer !== null) {
            this.removeChild(this.barsContainer);
            this.barsContainer = null;
        }
    }

    udpateSize() {
        const { barMinHeight } = this.options;
        this.bars = this.createBars(this.barsContainer, this.bars);

        const currentBarsCount = this.bars.length;
        for (let i = 0; i < currentBarsCount; i += 1) {
            const bar = this.bars[i];
            bar.scale.y = Math.max((bar.volume / 256) * this.cameraHeight, barMinHeight);
        }
    }
}

export default Audio;
