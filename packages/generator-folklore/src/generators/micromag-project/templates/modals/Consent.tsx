/* eslint-disable react/jsx-props-no-spreading */
import MicromagConsent from '@micromag/consent';
import classNames from 'classnames';
import React, { useEffect, useCallback, useRef } from 'react';

import useKeyboardKeys, { KEYS } from '../../hooks/useKeyboardKeys';

import { useLocale } from '../../contexts/LocaleContext';
import { useModal } from '../../contexts/ModalContext';

import styles from '../../styles/modals/consent.module.css';

function Consent({ className = null }: { className?: string | null }) {
    const modalRef = useRef(null);
    const { modal = null, setModal, unsetModal } = useModal();

    const onClose = useCallback(() => {
        unsetModal();
        setModal(null);
    }, [setModal]);

    const visible = modal !== null;

    useEffect(() => {
        if (modal !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [modal]);

    useKeyboardKeys({
        [KEYS.ESCAPE]: onClose,
    });

    return (
        <div
            className={classNames([
                styles.container,
                {
                    [styles.visible]: visible,
                    [className]: className !== null,
                },
            ])}
        >
            <div className={styles.wrapper} ref={modalRef}>
                <div className={styles.inner}>
                    <MicromagConsent
                        className={styles.consent}
                        onConfirm={onClose}
                        onClose={onClose}
                    />
                </div>
            </div>
            <div className={styles.lightBox} />
        </div>
    );
}

export default Consent;
