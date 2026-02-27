import { ReactNode } from 'react';

import styles from '<%= getRelativeStylesPath('components/layouts/Main.jsx', 'layouts/main.module.css') %>';

interface MainLayoutProps {
    children: ReactNode;
}

function MainLayout({ children = null }: MainLayoutProps) {
    return (
        <div className={styles.container}>
            <div className={styles.inner}>
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
};

export default MainLayout;
