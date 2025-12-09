import { useCallback, ReactNode } from 'react';

import { useModal } from '../../contexts/ModalContext';
import Button from '../buttons/Button';
import Cookie from '../icons/Cookie';
import Consent from '../modals/Consent';

import styles from '<%= getRelativeStylesPath('components/layouts/Main.jsx', 'layouts/main.module.css') %>';

interface MainLayoutProps {
    children?: ReactNode;
}

function MainLayout({ children = null }: MainLayoutProps) {
    const { modal = null, setModal = null } = useModal();
    const onClickCookie = useCallback(() => {
        if (setModal !== null) {
            setModal('consent');
        }
    }, [setModal]);

    return (
        <div className={styles.container}>
            <div className={styles.inner}>
                <div className={styles.content}>{children}</div>
            </div>
            {modal === 'consent' ? (
                <Consent className={styles.consentModal} />
            ) : (
                <Button className={styles.cookies} onClick={onClickCookie}>
                    <Cookie className={styles.cookieIcon} />
                </Button>
            )}
        </div>
    );
}

export default MainLayout;
