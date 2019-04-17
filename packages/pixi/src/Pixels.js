import {
    Container, Texture, Sprite, Point,
} from 'pixi.js';
import Color from 'color';
import get from 'lodash/get';

const createColorCanvas = (color, width, height) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    context.fillStyle = color;
    context.fillRect(0, 0, width, height);
    return canvas;
};

const colorDistance = (v1, v2) => {
    let d = 0;
    for (let i = 0; i < v1.length; i += 1) {
        d += (v1[i] - v2[i]) * (v1[i] - v2[i]);
    }
    return Math.sqrt(d);
};

class Pixels extends Container {
    constructor(opts) {
        super();

        this.options = {
            width: window.innerWidth,
            height: window.innerHeight,
            pixelWidth: 10,
            pixelHeight: 5,
            colors: [
                '#3300FF',
                '#6600FF',
                '#9900FF',
                '#CC00FF',
                '#FF00FF',
                '#FF00CC',
                '#FF3399',
                '#FF3366',
                '#FF6666',
                '#FF6633',
                '#FF9900',
                '#FFCC00',
                '#FFEE00',
            ],
            enableAlpha: false,
            minPixelAlpha: 0.2,
            hideTransparentPixels: true,
            deadPixelProbability: 0,
            colorOffsetProbability: 0.5,
            maxColorOffset: 4,
            draw: null,
            debug: false,
            debugContainer: null,
            debugContainerStyles: {
                position: 'fixed',
                top: '5px',
                left: '5px',
                background: '#fff',
                border: 'solid 2px #000',
                zIndex: 9999,
            },
            debugContainerParent: document.body,
            ...opts,
        };

        const {
            width, height, colors, pixelWidth, pixelHeight, debug,
        } = this.options;

        this.expandRadius = this.expandRadius.bind(this);
        this.glitch = this.glitch.bind(this);

        this.maxWidth = width;
        this.maxHeight = height;
        this.pixelWidth = pixelWidth;
        this.pixelHeight = pixelHeight;

        this.pixels = [];
        this.colors = [];
        this.colorsRgb = [];
        this.colorsCanvas = [];
        this.colorsTextures = [];
        this.imageData = null;
        this.savedImagesData = {};
        this.drawCanvas = document.createElement('canvas');
        this.drawContext = this.drawCanvas.getContext('2d');

        this.debugContainer = debug ? this.createDebugContainer() : null;

        this.updateCanvasSize();

        if (colors !== null) {
            this.setColors(colors);
        }
    }

    destroy() {
        if (this.debugContainer !== null) {
            this.destroyDebugContainer(this.debugContainer);
        }

        this.drawContext = null;
        this.drawCanvas = null;
        this.imageData = null;
        this.colors = [];

        this.pixels.forEach(pixel => pixel.destroy());
        this.pixels = [];

        this.colorsTextures.forEach(texture => texture.destroy());
        this.colorsTextures = [];
    }

    draw() {
        const { draw } = this.options;
        if (draw !== null) {
            draw(this.drawCanvas, this.drawContext);
        }
    }

    update() {
        this.updateImageData();
        this.updatePixels();
    }

    tick() {
        this.draw();
        this.update();
    }

    resize(width, height) {
        this.maxWidth = width;
        this.maxHeight = height;
        if (this.drawCanvas === null) {
            return;
        }
        this.updateCanvasSize();
        this.draw();
        this.updateImageData();
        this.resetPixels();
        this.updatePixels();
    }

    setOptions(opts) {
        this.options = {
            ...this.options,
            ...opts,
        };

        const pixelWidth = get(this.options, 'pixelWidth', null);
        const pixelHeight = get(this.options, 'pixelHeight', null);
        if (pixelWidth !== this.pixelWidth || pixelHeight !== this.pixelHeight) {
            this.setPixelSize(pixelWidth, pixelHeight);
        }

        const colors = get(this.options, 'colors', null);
        if (colors !== this.colors) {
            this.setColors(colors);
        }
    }

    setColors(colors) {
        this.colors = colors !== null ? colors.map(color => new Color(color)) : [];
        this.colorsRgb = this.colors.map(color => color.rgb().array());
        this.updateColorTextures();
    }

    setPixelSize(pixelWidth, pixelHeight) {
        this.pixelWidth = pixelWidth;
        this.pixelHeight = pixelHeight;
        this.updateCanvasSize();
        this.updateColorTextures();
    }

    updateCanvasSize() {
        const { width, height } = this.getCanvasSize();
        this.drawCanvas.width = width;
        this.drawCanvas.height = height;
    }

    updatePixels() {
        if (this.imageData === null) {
            return;
        }

        const { pixelWidth, pixelHeight } = this;

        const canvasSize = this.getCanvasSize();
        const rows = canvasSize.height;
        const cols = canvasSize.width;
        const scaleX = pixelWidth > pixelHeight ? pixelWidth / pixelHeight : 1;
        const scaleY = pixelHeight > pixelWidth ? pixelHeight / pixelWidth : 1;
        for (let row = 0; row < rows; row += 1 * scaleY) {
            for (let col = 0; col < cols; col += 1 * scaleX) {
                const pixel = this.updatePixel(row, col, rows, cols);
                pixel.position.set((col * pixelWidth) / scaleX, (row * pixelHeight) / scaleY);
            }
        }
    }

    updatePixel(row, col, rows, cols) {
        const { enableAlpha, minPixelAlpha, hideTransparentPixels } = this.options;
        const maxPixelIndex = (rows - 1) * cols + (cols - 1);
        const pixelIndex = row * cols + col;
        const imageDataIndex = pixelIndex * 4;
        const pixelColor = [
            this.imageData[imageDataIndex + 0],
            this.imageData[imageDataIndex + 1],
            this.imageData[imageDataIndex + 2],
            this.imageData[imageDataIndex + 3],
        ];
        const pixelAlpha = pixelColor[3] / 255;
        const colorIndex = this.getClosestColorIndex(pixelColor);

        // Create or update pixel sprite
        let pixel = this.pixels[pixelIndex] || null;
        if (pixel === null) {
            pixel = this.createPixelSprite(pixelIndex, colorIndex, pixelColor);
            this.addChild(pixel);
            this.pixels[pixelIndex] = pixel;
        } else if (pixel.pixelColorIndex !== colorIndex) {
            this.updatePixelSprite(pixel, colorIndex, pixelColor);
        }

        pixel.pixelPosition.set(col, row);

        // Hide transparent pixel
        // prettier-ignore
        const isTransparent = (hideTransparentPixels && pixelAlpha < minPixelAlpha)
            || pixel.pixelDead;
        const visibleAlpha = enableAlpha ? pixelAlpha : 1;
        if (isTransparent && !pixel.pixelTransparent) {
            pixel.pixelTransparent = true;
            pixel.alpha = 0;
        } else if (!isTransparent && pixel.pixelTransparent) {
            pixel.alpha = visibleAlpha;
            pixel.pixelTransparent = false;
        }

        // Disable visible
        const isUnused = pixelIndex > maxPixelIndex;
        if (isUnused) {
            pixel.pixelUnused = true;
            pixel.visible = false;
        } else if (!isUnused && pixel.pixelUnused) {
            pixel.visible = true;
            pixel.pixelUnused = false;
        }

        return pixel;
    }

    resetPixels() {
        this.pixels.forEach((pixel) => {
            this.removeChild(pixel);
            pixel.destroy();
        });
        this.pixels = [];
    }

    createPixelSprite(pixelIndex, colorIndex, color) {
        const {
            enableAlpha,
            deadPixelProbability,
            colorOffsetProbability,
            maxColorOffset,
        } = this.options;
        const colorOffset = Math.random() < colorOffsetProbability
            ? Math.round(-(maxColorOffset / 2) + Math.random() * maxColorOffset)
            : 0;
        const maxColorsIndex = this.colorsTextures.length - 1;
        const realColorIndex = Math.max(Math.min(colorIndex + colorOffset, maxColorsIndex), 0);
        const texture = this.colorsTextures[realColorIndex] || null;
        const pixelAlpha = color[3] / 255;
        const sprite = new Sprite(texture);
        sprite.alpha = enableAlpha ? pixelAlpha : 1;
        sprite.pixelPosition = new Point();
        sprite.pixelIndex = pixelIndex;
        sprite.pixelColorIndex = colorIndex;
        sprite.pixelColorOffset = colorOffset;
        sprite.pixelUnused = false;
        sprite.pixelDead = Math.random() < deadPixelProbability;
        sprite.pixelTransparent = false;
        return sprite;
    }

    /* eslint-disable no-param-reassign */
    updatePixelSprite(sprite, colorIndex, color) {
        const { enableAlpha } = this.options;
        const pixelAlpha = color[3] / 255;
        const maxColorsIndex = this.colorsTextures.length - 1;
        const realColorIndex = Math.max(
            Math.min(colorIndex + sprite.pixelColorOffset, maxColorsIndex),
            0,
        );
        sprite.texture = this.colorsTextures[realColorIndex];
        sprite.alpha = enableAlpha ? pixelAlpha : 1;
        sprite.pixelColorIndex = colorIndex;
        sprite.pixelTransparent = false;
        return sprite;
    }
    /* eslint-enable no-param-reassign */

    getClosestColorIndex(pixelColor) {
        let minDistance = Infinity;
        return this.colorsRgb.reduce((currentIndex, color, index) => {
            const distance = colorDistance(color, pixelColor);
            if (distance < minDistance) {
                minDistance = distance;
                return index;
            }
            return currentIndex;
        }, 0);
    }

    updateColorTextures() {
        // prettier-ignore
        this.colorsCanvas = this.colors.map(color => createColorCanvas(
            color.rgb(),
            this.pixelWidth,
            this.pixelHeight,
        ));

        const lastTextures = this.colorsTextures;

        this.colorsTextures = this.colorsCanvas.map((canvas, index) => {
            const color = this.colors[index];
            let texture = get(this.colorsTextures, index, null);
            if (texture === null || texture.pixelColor !== color) {
                texture = Texture.fromCanvas(canvas);
                texture.pixelColor = color;
            }
            return texture;
        });

        /* eslint-disable no-param-reassign */
        const [firstTexture] = this.colorsTextures;
        const maxColorsIndex = this.colorsTextures.length - 1;
        this.pixels.forEach((pixel) => {
            const colorIndex = this.colorsTextures.indexOf(pixel.texture);
            if (colorIndex === -1) {
                // prettier-ignore
                const realColorIndex = (
                    pixel.colorIndex + pixel.pixelColorOffset + maxColorsIndex
                ) % maxColorsIndex;
                const newTexture = get(this.colorsTextures, realColorIndex, null);
                if (newTexture !== null) {
                    pixel.texture = newTexture;
                } else {
                    pixel.texture = firstTexture;
                    pixel.pixelColorIndex = 0;
                }
            } else {
                pixel.pixelColorIndex = colorIndex;
            }
        });
        /* eslint-enable no-param-reassign */

        if (lastTextures.length > 0) {
            lastTextures.forEach((texture) => {
                if (this.colorsTextures.indexOf(texture) === -1) {
                    texture.destroy();
                }
            });
        }
    }

    getCanvasSize() {
        const { pixelWidth, pixelHeight } = this;
        const pixelSize = Math.min(pixelWidth, pixelHeight);
        const width = Math.ceil(this.maxWidth / pixelSize);
        const height = Math.ceil(this.maxHeight / pixelSize);
        return {
            width,
            height,
        };
    }

    updateImageData() {
        const { width, height } = this.getCanvasSize();
        if (width > 0 && height > 0) {
            this.imageData = this.drawContext.getImageData(0, 0, width, height).data;
        } else {
            this.imageData = null;
        }
    }

    saveImageData(name) {
        const imageName = name || 'default';
        const { width, height } = this.getCanvasSize();
        const imageData = this.drawContext.getImageData(0, 0, width, height);
        this.savedImagesData[imageName] = imageData;
    }

    restoreSavedImageData(name) {
        const imageName = name || 'default';
        const { width, height } = this.getCanvasSize();
        const imageData = this.savedImagesData[imageName] || null;
        if (imageData !== null) {
            this.drawContext.putImageData(imageData, width, height);
        }
        this.clearSavedImageData(name);
    }

    clearSavedImageData(name) {
        const imageName = name || 'default';
        this.savedImagesData = Object.keys(this.savedImagesData).reduce(
            (images, key) => (key !== imageName
                ? {
                    ...images,
                    [key]: this.savedImagesData[key],
                }
                : images),
            {},
        );
    }

    createDebugContainer() {
        const { debugContainer, debugContainerStyles, debugContainerParent } = this.options;
        let container = debugContainer;
        if (container === null) {
            container = document.createElement('div');
            Object.keys(debugContainerStyles).forEach((key) => {
                container.style[key] = debugContainerStyles[key];
            });
        }
        container.appendChild(this.drawCanvas);
        debugContainerParent.appendChild(container);
        return container;
    }

    destroyDebugContainer(debugContainer) {
        const { debugContainerParent } = this.options;
        debugContainer.removeChild(this.drawCanvas);
        debugContainerParent.removeChild(debugContainer);
    }
}

export default Pixels;
