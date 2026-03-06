import isFunction from 'lodash/isFunction';
import { useCallback } from 'react';

import useWindowEvent from './useWindowEvent';

type KeyMap =
    | Record<
          string,
          | ((event: KeyboardEvent) => void)
          | {
                down?: (event: KeyboardEvent) => void;
                up?: (event: KeyboardEvent) => void;
            }
      >
    | ((event: KeyboardEvent) => void)
    | null;

export default function useKeyboard(keyMap: KeyMap = null) {
    const onKeyDown = useCallback(
        (event: KeyboardEvent) => {
            const { key } = event;
            let callback = null;
            if (isFunction(keyMap)) {
                callback = keyMap;
            } else if (typeof keyMap[key] !== 'undefined') {
                callback = isFunction(keyMap[key]) ? keyMap[key] : (keyMap[key] || {}).down || null;
            }
            if (callback !== null) {
                callback(event);
            }
        },
        [keyMap],
    );
    const onKeyUp = useCallback(
        (event: KeyboardEvent) => {
            const { key } = event;
            let callback = null;
            if (isFunction(keyMap)) {
                callback = keyMap;
            } else if (typeof keyMap[key] !== 'undefined') {
                callback = isFunction(keyMap[key]) ? keyMap[key] : (keyMap[key] || {}).up || null;
            }
            if (callback !== null) {
                callback(event);
            }
        },
        [keyMap],
    );

    useWindowEvent('keydown', keyMap !== null ? onKeyDown : null);
    useWindowEvent('keyup', keyMap !== null ? onKeyUp : null);
}
