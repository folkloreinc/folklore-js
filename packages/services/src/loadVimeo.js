import createLoader from './createLoader';

const loadVimeo = createLoader(
    () => import('@vimeo/player'),
    ({ default: Player }) => Player,
);

export default loadVimeo;
