<?php

namespace App\Panneau\Resources\Pages;

use Panneau\Support\ResourceType;
use Folklore\Panneau\Fields\Blocks;
use Folklore\Panneau\Fields\Page as PageField;

class Page extends ResourceType
{
    public function id(): string
    {
        return 'page';
    }

    public function name(): string
    {
        return trans('panneau.pages_page');
    }

    public function fields(): array
    {
        return [
            PageField::make('parent')->withTransLabel('panneau.fields.parent'),
            Blocks::make('blocks')->withTransLabel('panneau.fields.blocks'),
        ];
    }
}
