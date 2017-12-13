import EventEmitter from 'wolfy87-eventemitter';
import { Promise } from 'es6-promise';
import MediaStreamRecorder from 'msr';

import dataUriToBlob from './dataUriToBlob';

class UserMedia extends EventEmitter {
    constructor(opts) {
        super();

        this.options = {
            type: 'video',
            mimeType: null,
            recorder: true,
            recordFilename: `file-${(new Date()).getTime()}`,
            ...opts,
        };

        this.onUserMediaSuccess = this.onUserMediaSuccess.bind(this);
        this.onUserMediaError = this.onUserMediaError.bind(this);
        this.onRecorderDataAvailable = this.onRecorderDataAvailable.bind(this);
        this.onRecorderStop = this.onRecorderStop.bind(this);
        this.onSnapshotVideoCanPlay = this.onSnapshotVideoCanPlay.bind(this);

        this.started = false;
        this.recording = false;
        this.recordingPaused = false;
        this.stream = null;
        this.streamUrl = null;
        this.recorder = null;
        this.recordedBlobs = null;
        this.recordedFile = null;
        this.snapshotCanvas = document.createElement('canvas');
    }

    onUserMediaSuccess(stream) {
        const { recorder } = this.options;
        this.started = true;
        this.stream = stream;
        if (recorder) {
            this.recorder = this.createRecorder(stream);
        }
        this.emit('started', stream);
    }

    onUserMediaError(err) {
        this.emit('error', err);
    }

    onRecorderStop() {
        this.emit('stop');
    }

    onRecorderDataAvailable(blob) {
        this.recordedBlobs.push(blob);
        this.recordedFile = this.createFile(this.recordedBlobs);
        this.emit('data', this.recordedFile, this.recordedBlobs);
    }

    onSnapshotVideoCanPlay() {
        const { videoWidth, videoHeight } = this.snapshotVideo;
        this.snapshotCanvas.width = videoWidth;
        this.snapshotCanvas.height = videoHeight;
        const context = this.snapshotCanvas.getContext('2d');
        context.drawImage(
            this.snapshotVideo,
            0, 0,
            videoWidth, videoHeight,
            0, 0,
            videoWidth, videoHeight,
        );
        const blob = dataUriToBlob(this.snapshotCanvas.toDataURL(this.getMimeType()));
        const file = this.createFile(blob);
        this.snapshotVideo.removeEventListener('canplay', this.onSnapshotVideoCanPlay);
        this.snapshotVideo.src = null;
        this.snapshotVideo = null;
        this.emit('data', file, blob);
    }

    start() {
        if (this.started) {
            return Promise.resolve();
        }
        const { type } = this.options;
        return new Promise((resolve, reject) => {
            navigator.getUserMedia({
                video: type === 'video' || type === 'image',
                audio: type === 'audio' || type === 'video',
            }, (stream) => {
                this.onUserMediaSuccess(stream);
                resolve(stream);
            }, (err) => {
                this.onUserMediaError(err);
                reject(err);
            });
        });
    }

    stop() {
        if (!this.started) {
            return Promise.resolve();
        }
        this.started = false;
        return Promise.resolve()
            .then(() => this.stopStream())
            .then(() => this.stopRecord());
    }

    snapshot() {
        this.snapshotVideo = document.createElement('video');
        this.snapshotVideo.addEventListener('canplay', this.onSnapshotVideoCanPlay);
        this.snapshotVideo.preload = 'auto';
        this.snapshotVideo.autoplay = true;
        this.snapshotVideo.src = this.getStreamUrl();
    }

    record(duration) {
        if (!this.started || this.recorder === null || this.recording) {
            return Promise.resolve();
        }
        this.recording = true;
        this.recordingPaused = false;
        this.recordedBlobs = [];
        this.recordedFile = null;
        return this.recorder.start(duration);
    }

    stopRecord() {
        if (!this.started || this.recorder === null || !this.recording) {
            return Promise.resolve();
        }
        this.recording = false;
        this.recordingPaused = false;
        return new Promise((resolve) => {
            this.once('data', (file, blobs) => {
                resolve(file, blobs);
                this.emit('file', file, blobs);
            });
            this.recorder.stop();
        });
    }

    pauseRecord() {
        if (!this.started || this.recorder === null) {
            return Promise.resolve();
        }
        this.recording = false;
        this.recordingPaused = true;
        return this.recorder.pause();
    }

    resumeRecord() {
        if (!this.started || this.recorder === null) {
            return Promise.resolve();
        }
        this.recording = false;
        this.recordingPaused = false;
        return this.recorder.resume();
    }

    getStream() {
        return this.stream;
    }

    getStreamUrl() {
        if (this.streamUrl === null) {
            const URL = window.URL || window.webkitURL;
            this.streamUrl = URL.createObjectURL(this.stream);
        }
        return this.streamUrl;
    }

    getMimeType() {
        const { type, mimeType } = this.options;

        if (mimeType !== null) {
            return mimeType;
        }

        if (type === 'video') {
            return 'video/webm';
        } else if (type === 'image') {
            return 'image/jpeg';
        } else if (type === 'audio') {
            return 'audio/wav';
        }

        return null;
    }

    getFilenameWithExtension(name) {
        if (name.match(/\.[a-z0-9]{2,4}$/i)) {
            return name;
        }
        const mime = this.getMimeType();
        const extension = mime.split('/')[1];
        return `${name}.${extension === 'jpeg' ? 'jpg' : extension}`;
    }

    destroy() {
        this.stop();

        if (this.recorder !== null) {
            this.recorder.stop();
            this.recorder = null;
        }
    }

    createRecorder(stream) {
        const recorder = new MediaStreamRecorder(stream);
        recorder.mimeType = this.getMimeType();
        recorder.ondataavailable = this.onRecorderDataAvailable;
        recorder.onstop = this.onRecorderStop;
        return recorder;
    }

    createFile(blob, name) {
        const { recordFilename } = this.options;
        const filename = this.getFilenameWithExtension(name || recordFilename);
        return new File(blob, filename, {
            type: this.getMimeType(),
        });
    }

    stopStream() {
        if (this.stream === null) {
            return;
        }
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
        this.streamUrl = null;
    }
}

export default UserMedia;
