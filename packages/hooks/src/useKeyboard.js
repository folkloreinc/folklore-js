import { useCallback } from 'react';

import useWindowEvent from './useWindowEvent';

export default function useKeyboard(keyMap = null) {
    const onKeyDown = useCallback(
        (event) => {
            const { key } = event;
            let callback = null;
            if (typeof keyMap === 'function') {
                callback = keyMap;
            } else if (typeof keyMap[key] !== 'undefined') {
                callback =
                    typeof keyMap[key] === 'function'
                        ? keyMap[key]
                        : (keyMap[key] || {}).down || null;
            }
            if (callback !== null) {
                callback(event);
            }
        },
        [keyMap],
    );
    const onKeyUp = useCallback(
        (event) => {
            const { key } = event;
            let callback = null;
            if (typeof keyMap === 'function') {
                callback = keyMap;
            } else if (typeof keyMap[key] !== 'undefined') {
                callback =
                    typeof keyMap[key] === 'function'
                        ? keyMap[key]
                        : (keyMap[key] || {}).up || null;
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
