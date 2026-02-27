import createDebug from 'debug';
import isString from 'lodash/isString';

type debug = (...args: unknown[]) => void;
type debugCreator = (namespace: string) => debug;

let debug: debug = createDebug('folklore:socket');

export function setDebug(newDebug: debugCreator | string) {
    debug = isString(newDebug) ? createDebug(newDebug) : newDebug;
}

export { debug };
