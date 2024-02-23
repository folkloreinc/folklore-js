import { inject } from 'regexparam';

export default function generatePath(path, data) {
    return inject(path, data);
}
