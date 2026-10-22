export default function loadChunk() {
    return import(/* webpackChunkName: "lazy" */ './lazy');
}
