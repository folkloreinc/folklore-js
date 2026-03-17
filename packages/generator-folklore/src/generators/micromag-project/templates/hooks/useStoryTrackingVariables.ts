import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';
import { useMemo } from 'react';

export function useStoryTrackingVariables(story: MicromagStory): Record<string, unknown> {
    const trackingVariables = useMemo(() => {
        // Organisation level
        const { organisation = null, document_id: documentId = null } = story || {};
        const { slug: organisationSlug = null, tracking = {} } = organisation || {};
        const { codes: orgCodes = [] } = tracking || {};

        const orgGoogleAnalyticsIds = (orgCodes || [])
            .filter((orgCode) => {
                const { type, id } = orgCode || {};
                return type === 'ga' && !isEmpty(id);
            })
            .map(({ id }) => id);

        // Story level
        const { tracking: { codes: storyCodes = [] } = {} } =
            story !== null ? story.settings || {} : {};

        const storyGoogleAnalyticsIds = (storyCodes || [])
            .filter((storyCode) => {
                const { type, id } = storyCode || {};
                return (type === 'ga' || type === 'ga4') && !isEmpty(id);
            })
            .map(({ id }) => id);

        return {
            documentId,
            organisationSlug,
            clientGoogleAnalyticsIds: uniq([...orgGoogleAnalyticsIds, ...storyGoogleAnalyticsIds]),
        };
    }, [story]);
    return trackingVariables;
}

export default useStoryTrackingVariables;
