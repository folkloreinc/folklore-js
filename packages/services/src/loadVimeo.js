import createLoader from './createLoader';

const loadVimeo = createLoader(
    () => import('@vimeo/player'),
    (library) =>
        (typeof window.Vimeo !== 'undefined' && typeof window.Vimeo.Player !== 'undefined'
            ? window.Vimeo.Player
            : null) ||
        (library || {}).default ||
        null,
);

export default loadVimeo;
