<?php

namespace App\Panneau\Resources\Blocks;

use Panneau\Support\ResourceType;
use Panneau\Fields\HtmlLocalized;

class TextBlock extends ResourceType
{
    public function id(): string
    {
        return 'text';
    }

    public function name(): string
    {
        return trans('panneau.blocks_text');
    }

    public function fields(): array
    {
        return [
            HtmlLocalized::make('body')
                ->withTransLabel('panneau.fields.body'),
        ];
    }
}
