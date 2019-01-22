<?php

namespace App\Composers;

use Illuminate\View\View;
use Illuminate\Http\Request;

class TranslationsComposer
{
    protected $translations = [
        'meta',
        'content',
    ];

    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function compose(View $view)
    {
        $locale = app()->getLocale();
        $view->translations = isset($view->translations) ? $view->translations : $this->getTranslations($locale);
    }

    protected function getTranslations($locale)
    {
        $translations = [];
        $translations[$locale] = [];
        foreach ($this->translations as $translation) {
            $texts = trans($translation, [], $locale);
            if (is_null($texts)) {
                continue;
            }
            $texts = is_string($texts) ? [$texts] : array_dot($texts);
            foreach ($texts as $key => $value) {
                $key = sizeof($texts) === 1 && $key === 0 ? $translation : ($translation.'.'.$key);
                $translations[$locale][$key] = preg_replace(
                    '/\:([a-z][a-z0-9\_\-]+)/',
                    '{$1}',
                    $value
                );
            }
        }
        return $translations;
    }
}
