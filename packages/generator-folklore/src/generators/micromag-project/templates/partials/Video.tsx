import classNames from 'classnames';

import styles from '<%= getRelativeStylesPath('components/partials/Video.jsx', 'partials/video.module.css') %>';

interface VideoProps {
    url?: string | null;
    thumbnail?: string | null;
    isPoster?: boolean;
    className?: string | null;
}

const Video = ({
    url = null,
    thumbnail = null,
    isPoster = false,
    className = null,
}: VideoProps) => {
    return url !== null || thumbnail !== null ? (
        <video
            className={classNames([
                styles.container,
                styles.video,
                { [className]: className !== null },
            ])}
            src={!isPoster && url !== null ? `${url}#t=0.01` : null}
            poster={thumbnail}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
        />
    ) : null;
};

export default Video;
