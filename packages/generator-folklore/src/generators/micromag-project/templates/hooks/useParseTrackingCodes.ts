import { useMemo } from 'react';

import { MicromagStory } from '../types/micromag';

export default function useParseTrackingCodes(
    trackingCodes?: string[] | null,
): (story: MicromagStory) => MicromagStory {
    const extraCodes = trackingCodes || [];
    return (story: MicromagStory) => {
        if (extraCodes.length <= 0 || story === null) {
            return story;
        }
        const { settings = {} } = story;
        const { tracking = {} } = settings || {};
        const { codes = [] } = tracking || {};
        return {
            ...story,
            settings: {
                ...settings,
                tracking: {
                    ...tracking,
                    codes: [
                        ...(codes || []),
                        ...extraCodes.map((code) => ({
                            id: code,
                            type: 'ga4',
                        })),
                    ],
                },
            },
        };
    };
}
