import EventEmitter from 'wolfy87-eventemitter';
import { Promise } from 'es6-promise';
import MediaStreamRecorder from 'msr';
import createDebug from 'debug';

import dataUriToBlob from './dataUriToBlob';

const debug = createDebug('folklore:user-media');

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
        this.onUserMediaStop = this.onUserMediaStop.bind(this);
        this.onUserMediaError = this.onUserMediaError.bind(this);
        this.onRecorderDataAvailable = this.onRecorderDataAvailable.bind(this);
        this.onRecorderStart = this.onRecorderStart.bind(this);
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
        debug('User media started');
        const { recorder } = this.options;
        this.started = true;
        this.stream = stream;
        if (recorder) {
            this.recorder = this.createRecorder(stream);
        }
        this.emit('start', stream);
    }

    onUserMediaError(err) {
        debug(`User media error: ${err}`);
        this.emit('error', err);
    }

    onUserMediaStop() {
        debug('User media stopped');
        this.emit('stop');
    }

    onRecorderStart() {
        debug('Recorder started');
        this.emit('record:start');
    }

    onRecorderStop() {
        debug('Recorder stopped');
        this.emit('record:stop');
    }

    onRecorderDataAvailable(blob) {
        this.recordedBlobs.push(blob);
        this.recordedFile = this.createFile(this.recordedBlobs);
        this.emit('data', this.recordedFile, this.recordedBlobs);
    }

    onSnapshotVideoCanPlay() {
        debug('Snapshot taken.');
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
        this.emit('file', file, blob);
    }

    start() {
        if (this.started) {
            return Promise.resolve();
        }
        debug('Starting user media...');
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
        debug('Stopping user media...');
        this.started = false;
        return Promise.resolve()
            .then(() => this.stopRecord())
            .then(() => this.stopStream())
            .then(() => this.onUserMediaStop());
    }

    snapshot() {
        debug('Taking a snapshot...');
        return new Promise((resolve) => {
            this.once('file', (file) => {
                resolve(file);
            });
            this.snapshotVideo = document.createElement('video');
            this.snapshotVideo.addEventListener('canplay', this.onSnapshotVideoCanPlay);
            this.snapshotVideo.preload = 'auto';
            this.snapshotVideo.autoplay = true;
            this.snapshotVideo.src = this.getStreamUrl();
        });
    }

    record(duration) {
        if (!this.started || this.recorder === null || this.recording) {
            return Promise.resolve();
        }
        this.recording = true;
        this.recordingPaused = false;
        this.recordedBlobs = [];
        this.recordedFile = null;
        return new Promise((resolve) => {
            this.recorder.start(duration);
            this.onRecorderStart();
            resolve();
        });
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
        debug('Destroying...');
        this.stop();
        this.destroyRecorder();
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

    destroyRecorder() {
        if (this.recorder) {
            this.recorder.stop();
            this.recorder = null;
        }
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
