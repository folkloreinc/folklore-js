<?php

namespace App\Panneau\Resources\Blocks;

use Panneau\Support\ResourceType;
use Panneau\Fields\Image;
use Panneau\Fields\HtmlLocalized;
use Panneau\Fields\TextLocalized;

class ImageBlock extends ResourceType
{
    public function id(): string
    {
        return 'image';
    }

    public function name(): string
    {
        return trans('panneau.blocks_image');
    }

    public function fields(): array
    {
        return [
            Image::make('image')->withTransLabel('panneau.fields.image'),
            HtmlLocalized::make('caption')->withTransLabel('panneau.fields.caption'),
            TextLocalized::make('credits')->withTransLabel('panneau.fields.credits'),
        ];
    }
}
