export interface IntlMessage {
    id?: string;
    defaultMessage?: string;
}

export interface Labels {
    [key: string]: string;
}

export interface Theme {
    name: string;
}

export interface ImageSize {
    id: string;
    url: string;
    width: number;
    height: number;
}

export interface Source {
    id: string;
    mime?: string | null;
    url: string;
    size?: number | null;
}

export interface Embed {
    provider: string;
    iframeUrl?: string;
    html?: string;
}

export interface Media {
    id: string;
    type: string;
    url: string;
    thumbnail_url?: string | null;
    name?: string | null;
    description?: string | null;
    files?: Record<string, Source>;
}

export interface Image extends Media, ImageSize {
    type: 'image';
    sizes: ImageSize[];
    credits?: string;
}

export interface Audio extends Media {
    type: 'audio';
}

export interface Video extends Media {
    type: 'video';
    embed?: Embed;
    sources?: Source[];
}

export interface MenuItem {
    id: string;
    href: string;
    external?: boolean;
    label?: string | ReactNode;
    icon?: ReactNode;
}

export interface Page {
    id: string;
    title?: string | null;
    slug?: string | null;
    path?: string | null;
    description?: string | null;
    image?: Image | null;
}

export interface User {
    id: string;
}

