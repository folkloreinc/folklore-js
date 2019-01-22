<?php

namespace App\Composers;

use Illuminate\View\View;
use Illuminate\Http\Request;
use Illuminate\Routing\Router;

class RoutesComposer
{
    protected $defaultRoutes = [

    ];

    protected $localizedRoutes = [
        'home',
        'test',
        'test_with_param'
    ];

    protected $request;
    protected $router;

    public function __construct(Request $request, Router $router)
    {
        $this->request = $request;
        $this->router = $router;
    }

    public function compose(View $view)
    {
        $locale = app()->getLocale();
        $view->routes = $this->getRoutes($locale, isset($view->routes) ? $view->routes : null);
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
