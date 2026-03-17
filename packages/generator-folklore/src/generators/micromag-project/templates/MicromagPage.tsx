import { useCallback } from 'react';
import { useLocation } from 'wouter';

import useMicromagStory from '../../hooks/useMicromagStory';

import Micromag from '../partials/Micromag';
import PageMeta from '../partials/PageMeta';

import styles from '<%= getRelativeStylesPath('components/pages/Micromag.jsx', 'pages/micromag.module.css') %>';

interface MicromagPageProps {
    micromag: MicromagItem;
    screen?: string | null;
    hasHome?: boolean;
}

function MicromagPage({ micromag, screen = null, hasHome = false }: MicromagPageProps) {
    const [, setLocation] = useLocation();
    const { slug = null } = micromag || {};
    const { story = null } = useMicromagStory(micromag);
    const { title = null } = story || {};

    const { components: screens = [] } = story || {};
    const baseUrl = slug !== null && hasHome ? `/${slug}` : '/';

    const pathScreenId = screen || null;
    const pathScreenIndex =
        pathScreenId !== null && pathScreenId.match(/^[0-9]+$/) !== null
            ? parseInt(pathScreenId, 10) - 1
            : null;
    const screenByPathId =
        pathScreenId !== null
            ? screens.find(({ id: screenId = null }) => screenId === pathScreenId) || null
            : null;
    const screenByPathIndex = pathScreenIndex !== null ? screens[pathScreenIndex] || null : null;
    const currentScreen =
        screenByPathId ||
        screenByPathIndex ||
        (pathScreenId === '' ? screens[0] : null) ||
        screens[0] ||
        null;

    const onScreenChange = useCallback(
        (newScreen = null) => {
            const { id: newScreenId = null } = newScreen || {};
            const newScreenIndex =
                screens.findIndex(({ id: screenId = null }) => screenId === newScreenId) || null;
            setLocation(
                newScreenIndex !== null && newScreenIndex > 0
                    ? `${baseUrl.replace(/\/$/, '')}/${newScreenIndex + 1}`
                    : `${baseUrl.replace(/\/$/, '')}/`,
            );
        },
        [screens, setLocation],
    );

    return (
        <div className={styles.container}>
            <PageMeta title={title} />
            <Micromag
                micromag={story}
                basePath={baseUrl}
                hasHome={hasHome}
                currentScreenId={currentScreen !== null ? currentScreen.id : undefined}
                className={styles.micromag}
                onScreenChange={onScreenChange}
            />
        </div>
    );
}

export default MicromagPage;
