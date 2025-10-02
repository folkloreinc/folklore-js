import styles from '<%= getRelativeStylesPath('components/layouts/Main.jsx', 'layouts/main.module.css') %>';

function MainLayout({ children = null }: { children: React.ReactNode }) {
    return (
        <div className={styles.container}>
            <div className={styles.inner}>
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
};

export default MainLayout;
