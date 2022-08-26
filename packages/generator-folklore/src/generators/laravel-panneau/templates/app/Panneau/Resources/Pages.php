<?php
namespace App\Panneau\Resources;

use App\Panneau\Fields\PageSlugLocalized;
use Panneau\Fields\TextLocalized;
use Panneau\Fields\ImageLocalized;
use Panneau\Fields\Toggle;
use Panneau\Support\Resource;

class Pages extends Resource
{
    public static $repository = \App\Contracts\Repositories\Pages::class;

    public static $controller = \App\Panneau\Http\Controllers\PagesController::class;

    public static $jsonResource = \App\Panneau\Http\Resources\PageResource::class;

    public static $jsonCollection = \App\Panneau\Http\Resources\PagesCollection::class;

    public static $types = [\App\Panneau\Resources\Pages\Page::class];

    public static $settings = [
        'hideInNavbar' => false,
        'indexIsPaginated' => true,
        'canCreate' => true,
    ];

    public function name(): string
    {
        return trans('panneau.pages.name');
    }

    public function index(): ?array
    {
        return [
            'columns' => [
                [
                    'label' => trans('panneau.columns.title'),
                    'component' => 'text-localized',
                    'path' => 'title',
                ],
                [
                    'id' => 'type',
                    'label' => 'Type',
                    'component' => 'label',
                    'labels' => $this->getTypes()->mapWithKeys(function ($type) {
                        return [
                            $type->id() => $type->name(),
                        ];
                    }),
                ],
                [
                    'id' => 'parent',
                    'label' => trans('panneau.columns.parent_page'),
                    'path' => 'parent.title.fr',
                ],
                'published',
                [
                    'id' => 'actions',
                    'actions' => ['show', 'edit', 'delete'],
                ],
            ],
            'filters' => [
                [
                    'name' => 'search',
                    'component' => 'search',
                    'placeholder' => trans('panneau.filters.search'),
                ],
            ],
        ];
    }

    public function fields(): array
    {
        return [
            Toggle::make('published')
                ->withTransLabel('panneau.fields.published')
                ->hideInForm(),
            TextLocalized::make('title')->withTransLabel('panneau.fields.title'),
            PageSlugLocalized::make('slug')
                ->isDisabled()
                ->withTransLabel('panneau.fields.url'),
            TextLocalized::make('description')
                ->isRequired()
                ->isTextarea()
                ->withTransLabel('panneau.fields.description_short'),
            ImageLocalized::make('image')
                ->withTransLabel('panneau.fields.image')
                ->withButton(),
        ];
    }
}
