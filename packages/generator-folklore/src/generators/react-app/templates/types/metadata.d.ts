export interface Microformat {
    '@context': string;
    '@type': string;
    identifier: string;
    [key: string]: unknown;
}

export interface Taxonomy {
    id: string;
    type: string;
    label: string;
    slug: string;
}

export interface Category extends Taxonomy {
    type: 'category';
}

export interface Author {
    id: string;
    slug: string;
    name: string;
    image?: Image | null;
    isPerson?: boolean;
}

export interface Credit {
    author?: Author | null;
    name?: string | null;
    role?: string;
}

export interface Organisation {
    id: string;
    name: string;
}
