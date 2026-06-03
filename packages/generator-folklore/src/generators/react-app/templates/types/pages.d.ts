
interface BaseCard {
    id: string;
    type: string;
    title?: string | null;
    description?: string | null;
    image?: Image | null;
}

type Card = BaseCard;

interface BaseBlock {
    id: string;
    uuid?: string;
    type: string;
    placement?: string;
}

interface TextBlock extends BaseBlock {
    type: 'text';
}

interface ImageBlock extends BaseBlock {
    type: 'image';
    media: {
        url: string;
        width?: number;
        height?: number;
    };
    caption?: string;
}

interface HeadingBlock extends BaseBlock {
    type: 'heading';
}

interface CardsBlock extends BaseBlock {
    type: 'cards';
    cards: Card[];
}

type Block = TextBlock | ImageBlock | HeadingBlock | CardsBlock | BaseBlock;

interface BasePage {
    id: string;
    title?: string | null;
    slug?: string | null;
    path?: string | null;
    description?: string | null;
    image?: Image | null;
}

type Page = BasePage;
