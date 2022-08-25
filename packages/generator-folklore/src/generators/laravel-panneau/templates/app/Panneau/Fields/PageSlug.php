<?php

namespace App\Panneau\Fields;

use Panneau\Fields\Text;

class PageSlug extends Text
{
    public function component(): string
    {
        return 'page-slug';
    }

    public function attributes(): ?array
    {
        $locale = app()->getLocale();
        $locales = config('locale.locales');
        $finalLocale = in_array($this->name, $locales) ? $this->name : $locale;

        return array_merge(parent::attributes(), [
            'routes' => [
                'page' => url()->routeForReactRouter($finalLocale . '.page', [
                    'withoutPatterns' => true,
                ]),
                'page_with_parent' => url()->routeForReactRouter(
                    $finalLocale . '.page_with_parent',
                    [
                        'withoutPatterns' => true,
                    ]
                ),
            ],
        ]);
    }
}
