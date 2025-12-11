import { MicromagStory } from '../types/micromag';

export default function addTrackingCodesToStory(story: MicromagStory, extraCodes: string[]) {
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
