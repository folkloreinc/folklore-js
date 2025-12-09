import { useWindowSize } from '@folklore/hooks';
import { DataProvider } from '@micromag/data';
import '@micromag/intl/locale/fr';
import Viewer from '@micromag/viewer';
import classNames from 'classnames';
import { useState, useCallback, useMemo, ReactNode } from 'react';

import useStoryTrackingVariables from '../../hooks/useStoryTrackingVariables';

import { MicromagStory } from '../../types/micromag';

import styles from '<%= getRelativeStylesPath('components/partials/Micromag.jsx', 'partials/micromag.module.css') %>';

interface MicromagProps {
    micromag: MicromagStory;
    viewerMenuHeader?: ReactNode;
    currentScreenId?: string | null;
    paused?: boolean;
    fullscreen?: boolean;
    autoFullscreen?: boolean;
    withoutPlaybackControls?: boolean;
    basePath?: string | null;
    withoutRouter?: boolean;
    // onStart?: () => void | null;
    onClose?: (() => void) | null;
    onEnd?: (() => void) | null;
    onScreenChange?: ((...args: any[]) => void) | null;
    onMenuChange?: ((...args: any[]) => void) | null;
    hasHome?: boolean;
    className?: string | number | symbol | any;
}

function Micromag({
    micromag,
    viewerMenuHeader = null,
    currentScreenId = null,
    paused = false,
    fullscreen: initialFullscreen = false,
    autoFullscreen = false,
    withoutPlaybackControls = false,
    basePath = null,
    withoutRouter = true,
    // onStart: customOnStart = null,
    onClose: customOnClose = null,
    onEnd: customOnEnd = null,
    onScreenChange = null,
    onMenuChange = null,
    hasHome = false,
    className = null,
}: MicromagProps) {
    const googleApiKey = null;
    const micromagApiBaseUrl = 'https://microm.ag/api';
    const { organisation = null } = micromag || {};
    const { branding = null } = organisation || {};

    const { width = 0, height = 0 } = useWindowSize();
    const [landscape, setLandscape] = useState(width > height);
    const [fullscreen, setFullscreen] = useState(autoFullscreen && !landscape && initialFullscreen);

    const onClose = useCallback(() => {
        if (autoFullscreen && fullscreen) {
            setFullscreen(false);
        }
        if (customOnClose !== null) {
            customOnClose();
        }
    }, [autoFullscreen, fullscreen, setFullscreen, customOnClose]);

    // const onStart = useCallback(() => {
    //     if (autoFullscreen && !landscape) {
    //         setFullscreen(true);
    //     }
    //     if (customOnStart !== null) {
    //         customOnStart();
    //     }
    // }, [autoFullscreen, setFullscreen, landscape, customOnStart]);

    const onEnd = useCallback(() => {
        if (autoFullscreen && fullscreen) {
            setFullscreen(false);
        }
        if (customOnEnd !== null) {
            customOnEnd();
        }
    }, [autoFullscreen, fullscreen, setFullscreen, customOnEnd]);

    const onViewModeChange = useCallback(
        ({ landscape: isLandscape = false }) => {
            setLandscape(isLandscape);
            if (autoFullscreen && !isLandscape) {
                setFullscreen(true);
            }
        },
        [autoFullscreen, setLandscape, setFullscreen],
    );

    const trackingVariables = useStoryTrackingVariables(micromag);

    const finalMicromag = useMemo(
        () => ({
            title: 'Custom micromag title',
            ...micromag,
        }),
        [micromag],
    );

    return (
        <div
            className={classNames([
                styles.container,
                {
                    [styles.fullscreen]: fullscreen,
                    [className]: className !== null,
                },
            ])}
        >
            <DataProvider apiBaseUrl={micromagApiBaseUrl}>
                <Viewer
                    story={finalMicromag}
                    trackingVariables={trackingVariables}
                    paused={paused}
                    theme={branding}
                    locale="fr"
                    visitor={null}
                    memoryRouter={basePath === null}
                    withoutRouter={withoutRouter}
                    basePath={basePath}
                    screen={currentScreenId}
                    closeable={(autoFullscreen && fullscreen) || customOnClose !== null}
                    googleApiKey={googleApiKey}
                    onViewModeChange={onViewModeChange}
                    onScreenChange={onScreenChange}
                    onMenuChange={onMenuChange}
                    onClose={onClose}
                    onEnd={onEnd}
                    withoutPlaybackControls={withoutPlaybackControls}
                    withNavigationHint
                    withMicromagBranding
                    pathWithIndex
                    menuHeader={viewerMenuHeader}
                    beforeScreensMenuButton={
                        hasHome
                            ? // <Link className={styles.link} to="/">
                              //     <FormattedMessage defaultMessage="Accueil" description="Homelink" />
                              // </Link>
                              null
                            : null
                    }
                />
            </DataProvider>
        </div>
    );
}

export default Micromag;

