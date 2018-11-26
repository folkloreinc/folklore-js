<?php

namespace App\Composers;

use Illuminate\View\View;
use Illuminate\Http\Request;
use Illuminate\Routing\Router;
use Illuminate\Contracts\View\Factory;
use StdClass;

class RootComposer
{
    protected $defaultRoutes = [

    ];

    protected $localizedRoutes = [
        'home',
        'test',
        'test_with_param'
    ];

    protected $translations = [
        'meta',
        'content',
    ];

    protected $request = null;
    protected $router = null;

    public function __construct(Request $request, Router $router)
    {
        $this->request = $request;
        $this->router = $router;
    }

    public function compose(View $view)
    {
        $path = '/'.ltrim($this->request->path(), '/');
        $locale = isset($view->locale) ? $view->locale : app()->getLocale();
        $routes = $this->getRoutes($locale, isset($view->routes) ? $view->routes : null);
        $translations = isset($view->translations) ? $view->translations : $this->getTranslations($locale);

        $view->props = [
            'url' => $path,
            'routes' => $routes,
            'locale' => $locale,
            'messages' => $translations,
        ];
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

    protected function getRoutes($locale, $routeNames = null)
    {
        $routes = [];
        $allRoutes = $this->router->getRoutes();
        if (is_null($routeNames)) {
            $routeNames = $this->getRoutesNames();
        }

        $patterns = $this->router->getPatterns();
        foreach ($routeNames as $name) {
            $route = $allRoutes->getByName($name);
            $parameters = $route->parameterNames();
            $key = preg_replace('/\.'.$locale.'$/', '', $name);
            $params = [];
            foreach ($parameters as $parameter) {
                $params[] = ':'.$parameter;
            }
            $path = route($name, $params, false);
            foreach ($parameters as $parameter) {
                if (isset($patterns[$parameter])) {
                    $pattern = preg_replace('/^\(?(.*?)\)?$/', '$1', $patterns[$parameter]);
                    $path = preg_replace('/('.preg_quote(':'.$parameter).')\b/i', '$1('.$pattern.')', $path);
                }
            }
            $routes[$key] = $routes[$name] = $path;
        }

        return $routes;
    }

    protected function getRoutesNames()
    {
        $locales = config('locale.locales');
        $routes = $this->defaultRoutes;
        foreach ($this->localizedRoutes as $routeName) {
            foreach ($locales as $locale) {
                $routes[] = $routeName.'.'.$locale;
            }
        }
        return $routes;
    }
}
