interface IntlMessage {
    id?: string;
    defaultMessage?: string;
}

interface Labels {
    [key: string]: string;
}

interface Theme {
    name: string;
}

interface ImageSize {
    id: string;
    url: string;
    width: number;
    height: number;
}

interface Source {
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
    name?: string | null;
    description?: string | null;
    files?: Record<string, Source>;
}

interface Image extends Media, ImageSize {
    type: 'image';
    sizes: ImageSize[];
    credits?: string;
}

interface Audio extends Media {
    type: 'audio';
}

interface Video extends Media {
    type: 'video';
    embed?: Embed;
    sources?: Source[];
}

interface MenuItem {
    id: string;
    href: string;
    external?: boolean;
    label?: string | ReactNode;
    icon?: ReactNode;
}

interface Page {
    id: string;
    title?: string | null;
    slug?: string | null;
    path?: string | null;
    description?: string | null;
    image?: Image | null;
}

interface User {
    id: string;
}

