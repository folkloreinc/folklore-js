import useMicromagStory from '../../hooks/useMicromagStory';
import { useMicromagVideo } from '../../hooks/useMicromagVideo';

import { MicromagItem } from '../../types/micromag';
import Preview from './Preview';
import Video from './Video';

interface ThumbnailProps {
    micromag?: MicromagItem | null;
    isPoster?: boolean;
    className?: string | null;
}

const Thumbnail = ({ micromag = null, isPoster = false, className = null }: ThumbnailProps) => {
    const { story = null, loading = false } = useMicromagStory(micromag);
    const { url, thumbnail } = useMicromagVideo(story);
    return url !== null || thumbnail !== null ? (
        <Video url={url} thumbnail={thumbnail} isPoster={isPoster} className={className} />
    ) : (
        <Preview story={story} className={className} />
    );
};

export default Thumbnail;
