<?php

namespace App\View\Composers;

use Illuminate\View\View;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class TranslationsComposer
{
    protected $namespaces = ['*', 'content', 'meta'];

    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function compose(View $view)
    {
        $locale = app()->getLocale();
        $view->translations = isset($view->translations)
            ? $view->translations
            : $this->getTranslations($locale);
    }

    protected function getTranslations($locale)
    {
        $translations = [];
        foreach ($this->namespaces as $namespace) {
            $texts = trans($namespace, [], $locale);
            if (is_null($texts)) {
                continue;
            }
            $texts = is_string($texts) ? [$texts] : Arr::dot($texts);
            foreach ($texts as $key => $value) {
                if (sizeof($texts) === 1 && $key === 0) {
                    $key = $namespace;
                } elseif ($namespace !== '*') {
                    $key = $namespace . '.' . $key;
                }
                $translations[$key] = preg_replace('/\:([a-z][a-z0-9\_\-]+)/', '{$1}', $value);
            }
        }
        return $translations;
    }
}
