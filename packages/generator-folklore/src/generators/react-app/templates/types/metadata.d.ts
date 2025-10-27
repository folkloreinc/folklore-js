interface Microformat {
    '@context': string;
    '@type': string;
    identifier: string;
    [key: string]: unknown;
}

interface Taxonomy {
    id: string;
    type: string;
    label: string;
    slug: string;
}

interface Category extends Taxonomy {
    type: 'category';
}

interface Author {
    id: string;
    slug: string;
    name: string;
    image?: Image | null;
    isPerson?: boolean;
}

interface Credit {
    author?: Author | null;
    name?: string | null;
    role?: string;
}

interface Organisation {
    id: string;
    name: string;
}
