import { useMemo } from 'react';
import { MicromagStory } from '../types/micromag';

export function useMicromagPreview(story: MicromagStory) {
    return useMemo(() => {
        const { components = null } = story || {};
        const [firstScreen = null] = components || [];
        return {
            ...(story || {}),
            components: [firstScreen],
        };
    }, [story]);
}

export default useMicromagPreview;
