interface ImageSize {
    id: string;
    url: string;
    width: number;
    height: number;
}

interface MediaSource {
    id: string;
    mime?: string | null;
    url: string;
    size?: number | null;
}

interface Embed {
    provider: string;
    iframeUrl?: string;
    html?: string;
}

interface Media {
    id: string;
    type: string;
    url: string;
    thumbnail_url?: string | null;
    name?: string | null;
    description?: string | null;
    files?: Record<string, MediaSource>;
    sources?: MediaSource[];
}

interface ImageMedia extends Media, ImageSize {
    type: 'image';
    sizes: ImageSize[];
    credits?: string;
}

interface AudioMedia extends Media {
    type: 'audio';
}

interface VideoMedia extends Media {
    type: 'video';
    embed?: Embed;
}
