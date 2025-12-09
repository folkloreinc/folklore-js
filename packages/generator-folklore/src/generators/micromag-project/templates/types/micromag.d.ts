export interface MicromagTrackingCode {
    id: string;
    type: string;
    [key: string]: unknown;
}

export interface MicromagVideo {
    media?: string;
    [key: string]: unknown;
}

export interface MicromagComponent {
    id: string;
    type: string;
    video?: MicromagVideo;
    background?: {
        video?: MicromagVideo;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

export interface MicromagOrganisation {
    slug?: string;
    tracking?: {
        codes?: MicromagTrackingCode[];
        [key: string]: unknown;
    };
    branding?: {
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

export interface MicromagStory {
    title?: string;
    metadata?: {
        [key: string]: unknown;
    };
    organisation?: MicromagOrganisation;
    settings?: {
        tracking?: {
            codes?: MicromagTrackingCode[];
            [key: string]: unknown;
        };
        [key: string]: unknown;
    };
    components: MicromagComponent[];
    medias?: Record<string, Media>;
    [key: string]: unknown;
}

export interface MicromagItem {
    id: string;
    slug: string;
    story?: MicromagStory;
    url?: string | null;
}
