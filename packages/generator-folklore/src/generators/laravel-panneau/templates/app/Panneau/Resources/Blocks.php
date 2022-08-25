<?php

namespace App\Panneau\Resources;

use Panneau\Support\Resource;

class Blocks extends Resource
{
    public static $repository = \App\Contracts\Repositories\Blocks::class;

    public static $jsonResource = \App\Panneau\Http\Resources\BlockResource::class;

    public static $jsonCollection = \App\Panneau\Http\Resources\BlocksCollection::class;

    public static $settings = [
        'hideInNavbar' => true,
    ];

    public static $types = [\App\Panneau\Resources\Blocks\TextBlock::class];

    public function name(): string
    {
        return trans('panneau.blocks.name');
    }

    public function index(): ?array
    {
        return [
            'columns' => [
                [
                    'id' => 'type',
                    'label' => 'Type',
                ],
            ],
        ];
    }

    public function fields(): array
    {
        return [];
    }
}
