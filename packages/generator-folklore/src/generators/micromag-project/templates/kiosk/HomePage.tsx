import { Link, Redirect } from 'wouter';

import Thumbnail from '../partials/Thumbnail';

import styles from '<%= getRelativeStylesPath('components/pages/Home.jsx', 'pages/home.module.css') %>';

interface HomePageProps {
    screen?: string | null;
    micromags?: Record<string, any> | null;
}

function HomePage({ micromags = null }: HomePageProps) {
    if (micromags === null || micromags.length === 0) {
        return <div className={styles.container} />;
    }

    if (micromags.length === 1) {
        return <Redirect to={`/${micromags[0].slug}`} />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {(micromags || []).map((micromag) => (
                    <Link key={micromag.id} href={`/${micromag.slug}`} className={styles.cellLink}>
                        <Thumbnail micromag={micromag} className={styles.cell} />
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default HomePage;

