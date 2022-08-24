<?php
namespace App\Panneau\Resources;

use App\Panneau\Fields\ImageLocalized;
use App\Panneau\Fields\PageSlugLocalized;
use Panneau\Fields\TextLocalized;
use Panneau\Fields\Toggle;
use Panneau\Support\Resource;

class Pages extends Resource
{
    public static $repository = \App\Contracts\Repositories\Pages::class;

    public static $controller = \App\Panneau\Http\Controllers\PagesController::class;

    public static $jsonResource = \App\Panneau\Http\Resources\PageResource::class;

    public static $jsonCollection = \App\Panneau\Http\Resources\PagesCollection::class;

    public static $types = [
        \App\Panneau\Resources\Pages\Page::class,
    ];

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
                    'label' => trans('panneau.fields.title'),
                    'component' => 'text-localized',
                    'path' => 'title',
                ],
                [
                    'id' => 'type',
                    'label' => 'Type',
                    'component' => 'label',
                    'labels' => [
                        'page' => trans('panneau.pages_page'),
                        'home' => trans('panneau.pages_home'),
                        'about' => trans('panneau.pages_about'),
                        'contact' => trans('panneau.pages_contact'),
                        'news' => trans('panneau.pages_news'),
                        'index' => trans('panneau.pages_index'),
                        'section' => trans('panneau.pages_section'),
                        'media' => trans('panneau.pages_media'),
                    ],
                ],
                [
                    'id' => 'parent',
                    'label' => trans('panneau.page_parent'),
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
                ->withTransHelpText('panneau.help_texts.description_short')
                ->withTransLabel('panneau.fields.description_short'),
            ImageLocalized::make('image')
                ->withTransLabel('panneau.fields.image')
                ->withTransHelpText('panneau.help_texts.page_image')
                ->withButton(),
        ];
    }
}
