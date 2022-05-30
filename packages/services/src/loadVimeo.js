import createLoader from './createLoader';

const loadVimeo = createLoader(
    () => import('@vimeo/player').then(({ default: Player }) => Player),
    () =>
        typeof window.Vimeo !== 'undefined' && typeof window.Vimeo.Player !== 'undefined'
            ? window.Vimeo.Player
            : null,
);

export default loadVimeo;
