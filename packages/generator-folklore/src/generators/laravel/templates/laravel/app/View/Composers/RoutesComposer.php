<?php

namespace App\View\Composers;

use Illuminate\View\View;
use Illuminate\Http\Request;
use Illuminate\Routing\Router;
use Illuminate\Contracts\Routing\UrlGenerator;
use App\Contracts\Repositories\Pages as PagesRepository;
use Illuminate\Contracts\Cache\Repository as CacheRepository;

class RoutesComposer
{
    protected $removeNamespace = null;

    protected $defaultRoutes = [];

    protected $localizedRoutes = [
        'home',
        'home.json',
    ];

    protected $localizedHandles = ['calendar', 'films', 'articles', 'search', 'tickets'];

    protected $indexHandles = ['calendar', 'films', 'articles', 'pages'];

    protected $request;

    protected $router;

    protected $cache;

    protected $urlGenerator;

    protected $pagesRepository;

    public function __construct(
        Request $request,
        Router $router,
        CacheRepository $cache,
        UrlGenerator $urlGenerator,
        PagesRepository $pagesRepository
    ) {
        $this->request = $request;
        $this->router = $router;
        $this->cache = $cache;
        $this->urlGenerator = $urlGenerator;
        $this->pagesRepository = $pagesRepository;
    }

    public function compose(View $view)
    {
        $locale = app()->getLocale();
        $view->routes = $this->getRoutes($locale, isset($view->routes) ? $view->routes : null);

        $view->handles =
            app()->environment() !== 'production' && false
                ? $this->getHandles($locale)
                : $this->cache->rememberForever('handles_' . $locale, function () use ($locale) {
                    return $this->getHandles($locale);
                });

        $view->indexSlugs =
            app()->environment() !== 'production' && false
                ? $this->getIndexSlugs($locale)
                : $this->cache->rememberForever('index_slugs_' . $locale, function () use (
                    $locale
                ) {
                    return $this->getIndexSlugs($locale);
                });
    }

    protected function getRoutes($locale, $routeNames = null)
    {
        $routes = [];
        $allRoutes = $this->router->getRoutes();

        if (is_null($routeNames)) {
            $routeNames = $this->getRoutesNames();
        }

        foreach ($routeNames as $name) {
            $key = !is_null($this->removeNamespace)
                ? preg_replace('/^((.*)\.)?' . $this->removeNamespace . '\./', '$1', $name)
                : $name;
            $keyWithoutLocale = preg_replace('/^' . $locale . '\./', '', $key);
            $path = url()->routeForReactRouter($name);
            if (!is_null($path)) {
                $routes[$key] = $routes[$keyWithoutLocale] = $path;
            }
        }

        return $routes;
    }

    protected function getRoutesNames()
    {
        $locales = config('locale.locales');
        $routes = $this->defaultRoutes;
        foreach ($this->localizedRoutes as $routeName) {
            foreach ($locales as $locale) {
                $routes[] = $locale . '.' . $routeName;
            }
        }
        return $routes;
    }

    protected function getHandles($locale)
    {
        $routes = [];
        foreach ($this->localizedHandles as $handle) {
            $page = $this->pagesRepository->findByHandle($handle);
            $routes[$handle] = $page->url($locale);
        }
        return $routes;
    }

    protected function getIndexSlugs($locale)
    {
        $routes = [];
        foreach ($this->indexHandles as $handle) {
            $page = $this->pagesRepository->findByHandle($handle);
            $routes[$handle] = $page->slug($locale);
        }
        return $routes;
    }
}
