import Viewer from '@micromag/viewer';
import classNames from 'classnames';

import { useMicromagPreview } from '../../hooks/useMicromagPreview';

import styles from '<%= getRelativeStylesPath('components/partials/Preview.jsx', 'partials/preview.module.css') %>';

interface MicromagPreviewProps {
    story?: Record<string, any> | null;
    className?: string | number | symbol | any;
}

const Preview = ({ story = null, className = null }: MicromagPreviewProps) => {
    const simpleStory = useMicromagPreview(story);
    return (
        <Viewer
            story={simpleStory}
            className={classNames([styles.container, { [className]: className !== null }])}
            withoutMenu
            withoutGestures
            withoutNavigationArrow
            withNavigationHint={false}
            withoutPlaybackControls
        />
    );
};

export default Preview;
