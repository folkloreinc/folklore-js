<?php

namespace App\Routing;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Routing\Router;
use App\Support\AttachToMacroable;

class RouteMixin
{
    use AttachToMacroable;

    protected $app;

    protected $router;

    public function __construct(Application $app, Router $router)
    {
        $this->app = $app;
        $this->router = $router;
    }

    public function locale()
    {
        $router = $this->router;
        return function ($locale, $updateName = true) use ($router) {
            // Set action
            $action = $this->getAction();
            $action['locale'] = $locale;
            $this->setAction($action);

            // Update name
            $name = $this->getName();
            if ($updateName && preg_match('/^' . $locale . '\./', $name) === 0) {
                $nameWithLocale = $router->nameWithLocale($name, $locale);
                $this->name($nameWithLocale);
            }
        };
    }

    public function nameWithLocale()
    {
        $router = $this->router;
        return function ($name, $locale = null) use ($router) {
            if (is_null($locale)) {
                $locale = $this->getAction('locale');
            }
            $nameWithLocale = $router->nameWithLocale($name, $locale);
            return $this->name($nameWithLocale);
        };
    }
}
