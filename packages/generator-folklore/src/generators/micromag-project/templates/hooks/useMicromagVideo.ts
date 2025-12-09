import { useMemo } from 'react';

import { MicromagStory } from '../types/micromag';

export function useMicromagVideo(story: MicromagStory) {
    const video = useMemo(() => {
        const { components = null, medias = null } = story || {};
        const [firstScreen = null] = components || [];
        const { video = null, background = null } = firstScreen || {};
        const { media: videoMedia = null } = video || {};

        const { video: backgroundVideo = null } = background || {};
        const { media: backgroundVideoMedia = null } = backgroundVideo || {};

        const videoId = videoMedia || backgroundVideoMedia || null;
        if (videoId === null) {
            return null;
        }

        if (medias !== null && typeof medias[videoId] !== 'undefined') {
            return medias[videoId];
        }

        return null;
    }, [story]);

    const { files = null, thumbnail_url: thumbnail = null } = video || {};
    const { h264 = null } = files || {};
    const { url = null } = h264 || {};

    return {
        url,
        thumbnail,
    };
}

export default useMicromagVideo;
