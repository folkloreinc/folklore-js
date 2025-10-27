export interface BaseBlock {
    id: string;
    uuid?: string;
    type: string;
    placement?: string;
}

export interface TextBlock extends BaseBlock {
    type: 'text';
}

export interface ImageBlock extends BaseBlock {
    type: 'image';
    media: {
        url: string;
        width?: number;
        height?: number;
    };
    caption?: string;
}

export interface HeadingBlock extends BaseBlock {
    type: 'heading';
}

export interface CardsBlock extends BaseBlock {
    type: 'cards';
    cards: Card[];
}

export type Block = TextBlock | ImageBlock | HeadingBlock | CardsBlock | BaseBlock;

export interface BaseCard {
    id: string;
    type: string;
    title?: string | null;
    description?: string | null;
    image?: Image | null;
}

export type Card = BaseCard;
