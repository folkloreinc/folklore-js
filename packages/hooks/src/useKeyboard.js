import { useCallback } from 'react';
import useWindowEvent from './useWindowEvent';

function useKeyboard(keyMap = null) {
    const onKeyDown = useCallback(
        (event) => {
            const { key } = event;
            const callback =
                (typeof keyMap[key] === 'function' ? keyMap[key] : (keyMap[key] || {}).down) ||
                null;
            if (callback !== null) {
                callback(event);
            }
        },
        [keyMap],
    );
    const onKeyUp = useCallback(
        (event) => {
            const { key } = event;
            const callback =
                (typeof keyMap[key] !== 'undefined' && typeof keyMap[key] !== 'function'
                    ? (keyMap[key] || {}).up
                    : null) || null;
            if (callback !== null) {
                callback(event);
            }
        },
        [keyMap],
    );

    useWindowEvent('keydown', keyMap !== null ? onKeyDown : null);
    useWindowEvent('keyup', keyMap !== null ? onKeyUp : null);
}

export default useKeyboard;
