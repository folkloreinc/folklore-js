import { TimelineMax, Linear, Power1 } from 'gsap';
import Hammer from 'hammerjs';
import { Instance as Hamster } from 'hamsterjs';
import EventEmitter from 'wolfy87-eventemitter';

class PanContainer extends EventEmitter {
    constructor(container, opts) {
        super();

        this.resetTimeline = this.resetTimeline.bind(this);
        this.onSwipeUp = this.onSwipeUp.bind(this);
        this.onSwipeDown = this.onSwipeDown.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);
        this.onMouseWheelEnd = this.onMouseWheelEnd.bind(this);
        this.onPanStart = this.onPanStart.bind(this);
        this.onPan = this.onPan.bind(this);
        this.onPanEnd = this.onPanEnd.bind(this);
        this.onUpdate = this.onUpdate.bind(this);

        this.options = {
            mouseWheel: true,
            pan: true,
            swipe: true,
            enabled: true,
            axis: 'y',
            mouseWheelTimeout: 100,
            ease: Power1.easeOut,
            minDelta: 0.3,
            speed: 2,
            minProgress: -1,
            maxProgress: 1,
            maxHeight: window.innerHeight,
            ...opts,
        };

        this.container = container;
        this.enabled = this.options.enabled;
        this.hammer = null;
        this.hamster = null;
        this.lastDeltaX = null;
        this.lastDeltaY = null;
        this.mousewheelTimeout = null;
        this.mouseWheelStarted = false;
        this.maxHeight = this.options.maxHeight;
        this.panning = false;
        this.panStartProgress = 0;
        this.panProgress = 0;
        this.panTween = null;
        this.endTween = null;
        this.panTimeline = null;

        this.init();
    }

    init() {
        const {
            pan,
            swipe,
            mouseWheel,
            axis,
            speed,
            minProgress,
            maxProgress,
        } = this.options;

        // Gestures
        if (pan || swipe) {
            const directions = {
                x: Hammer.DIRECTION_HORIZONTAL,
                y: Hammer.DIRECTION_VERTICAL,
                xy: Hammer.DIRECTION_ALL,
            };
            const direction = directions[axis] || Hammer.DIRECTION_NONE;
            this.hammer = new Hammer(this.container);
            if (swipe) {
                this.hammer.get('swipe').set({
                    direction,
                });
                this.hammer.on('swipeup', this.onSwipeUp);
                this.hammer.on('swipedown', this.onSwipeDown);
            }

            if (pan) {
                this.hammer.get('pan').set({
                    direction,
                });
                this.hammer.on('pan', this.onPan);
                this.hammer.on('panstart', this.onPanStart);
                this.hammer.on('panend', this.onPanEnd);
            }
        }

        // Hamster
        if (mouseWheel) {
            this.hamster = new Hamster(this.container);
            this.hamster.wheel(this.onMouseWheel);
        }

        // Timeline
        this.panTimeline = new TimelineMax({
            paused: true,
        });
        this.panTimeline.fromTo(this, speed, {
            panProgress: minProgress,
        }, {
            panProgress: maxProgress,
            ease: Linear.easeNone,
        });
        this.panTimeline.progress(0.5);
    }

    onSwipeUp() {
        if (!this.enabled) {
            return;
        }

        this.panUp();
    }

    onSwipeDown() {
        if (!this.enabled) {
            return;
        }

        this.panDown();
    }

    onMouseWheel(event, delta, deltaX, deltaY) {
        const { axis } = this.options;

        this.stopMouseWheelTimeout();

        if (
            !this.enabled || this.panning ||
            (this.lastDeltaX === null && axis === 'x' && Math.abs(deltaY) > Math.abs(deltaX)) ||
            (this.lastDeltaY === null && axis === 'y' && Math.abs(deltaX) > Math.abs(deltaY))
        ) {
            return;
        }

        if (!this.mouseWheelStarted) {
            this.mouseWheelStarted = true;
            this.panStartProgress = this.panTimeline.progress();
            this.emit('start');
        }

        this.panWithDelta(
            this.lastDeltaX !== null ? -deltaX + this.lastDeltaX : 0,
            this.lastDeltaY !== null ? deltaY + this.lastDeltaY : 0,
        );
        this.lastDeltaX = -deltaX;
        this.lastDeltaY = deltaY;

        this.startMouseWheelTimeout();
    }

    onMouseWheelEnd() {
        this.stopMouseWheelTimeout();
        this.mouseWheelStarted = false;
        this.lastDeltaX = null;
        this.lastDeltaY = null;
        this.endPan();
    }

    onPanStart() {
        if (!this.enabled) {
            return;
        }

        this.panning = true;
        this.panStartProgress = this.panTimeline.progress();

        if (this.mousewheelTimeout) {
            clearTimeout(this.mousewheelTimeout);
            this.mousewheelTimeout = null;
        }

        this.emit('start');
    }

    onPan({ deltaY, deltaX }) {
        if (!this.enabled) {
            return;
        }

        this.panWithDelta(
            this.lastDeltaX !== null ? deltaX - this.lastDeltaX : 0,
            this.lastDeltaY !== null ? deltaY - this.lastDeltaY : 0,
        );
        this.lastDeltaX = deltaX;
        this.lastDeltaY = deltaY;
    }

    onPanEnd() {
        if (!this.enabled) {
            return;
        }

        this.panning = false;
        this.lastDeltaX = null;
        this.lastDeltaY = null;
        this.endPan();
    }

    onUpdate() {
        this.emit('pan', this.panProgress);
    }

    setMaxHeight(maxHeight) {
        this.maxHeight = maxHeight;
        return this;
    }

    startMouseWheelTimeout() {
        const { mouseWheelTimeout } = this.options;
        this.mousewheelTimeout = setTimeout(this.onMouseWheelEnd, mouseWheelTimeout);
    }

    stopMouseWheelTimeout() {
        if (this.mousewheelTimeout === null) {
            return;
        }
        clearTimeout(this.mousewheelTimeout);
        this.mousewheelTimeout = null;
    }

    panWithDelta(deltaX, deltaY) {
        const { axis } = this.options;
        const distances = {
            x: -deltaX,
            y: -deltaY,
        };
        const distance = typeof distances[axis] !== 'undefined' ? distances[axis] : null;
        if (distance !== null) {
            this.panWithDistance(distance);
        } else {
            this.panWithDistances(distances);
        }
    }

    panWithDistance(distance) {
        const { minProgress, maxProgress } = this.options;
        const { maxHeight } = this;
        const deltaProgress = distance / maxHeight;
        const panProgress = Math.min(
            Math.max(minProgress, this.panProgress + deltaProgress),
            maxProgress,
        );
        const maxDelta = maxProgress - minProgress;
        const progress = (panProgress - minProgress) / maxDelta;
        this.pan(progress);
    }

    pan(progress) {
        const time = this.panTimeline.duration() * progress;
        return this.tweenPanTimeline(time);
    }

    panUp() {
        const time = this.panTimeline.duration();
        const tween = this.tweenPanTimeline(time);
        if (tween !== null) {
            tween.eventCallback('onComplete', this.resetTimeline);
        } else {
            this.resetTimeline();
        }
        return tween;
    }

    panDown() {
        const tween = this.tweenPanTimeline(0);
        if (tween !== null) {
            tween.eventCallback('onComplete', this.resetTimeline);
        } else {
            this.resetTimeline();
        }
        return tween;
    }

    resetPan() {
        const time = this.panTimeline.duration() * 0.5;
        return this.tweenPanTimeline(time);
    }

    resetTimeline() {
        this.panTimeline.progress(0.5, true);
    }

    tweenPanTimeline(time) {
        const { ease } = this.options;
        if (time === this.panTimeline.time()) {
            return null;
        }
        if (this.panTween !== null) {
            this.panTween.kill();
            this.panTween = null;
        }
        if (this.endTween !== null) {
            this.endTween.kill();
            this.endTween = null;
        }
        this.panTween = this.panTimeline.tweenTo(time, {
            ease,
        });
        this.panTween.eventCallback('onUpdate', this.onUpdate);
        return this.panTween;
    }

    endPan() {
        const { minDelta, minProgress, maxProgress } = this.options;
        const middle = minProgress + ((maxProgress - minProgress) / 2);
        const delta = Math.abs(this.panProgress - middle);
        let tween = null;
        if (this.panProgress > middle && delta > minDelta) {
            tween = this.panUp();
        } else if (this.panProgress < middle && delta > minDelta) {
            tween = this.panDown();
        } else {
            tween = this.resetPan();
        }

        if (tween !== null) {
            this.endTween = (new TimelineMax())
                .add(tween)
                .eventCallback('onComplete', () => {
                    this.emit('end');
                });
        } else {
            this.emit('end');
        }
    }

    disable() {
        this.enabled = false;
    }

    enable() {
        this.enabled = true;
    }

    destroy() {
        this.off('pan');

        if (this.hammer !== null) {
            this.hammer.destroy();
            this.hammer = null;
        }

        if (this.hammer !== null) {
            this.hamster.unwheel(this.onMouseWheel);
            this.hamster = null;
        }

        if (this.panTween !== null) {
            this.panTween.kill();
            this.panTween = null;
        }

        if (this.panTimeline !== null) {
            this.panTimeline.kill();
            this.panTimeline = null;
        }
    }
}

export default PanContainer;
