<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\View\Factory as ViewFactory;
use Illuminate\Foundation\Events\LocaleUpdated;
use Illuminate\Routing\Events\RouteMatched;
use Illuminate\Http\Request;

class LocalizationServiceProvider extends ServiceProvider
{
    protected function getLocales()
    {
        return $this->app['config']->get('locale.locales');
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->bootView();

        $this->bootRouting();
    }

    /**
     * Bootstrap view
     *
     * @return void
     */
    protected function bootView()
    {
        $this->app[ViewFactory::class]->share('locale', $this->app->getLocale());
        $this->app['events']->listen(LocaleUpdated::class, function (LocaleUpdated $event) {
            $this->app[ViewFactory::class]->share('locale', $event->locale);
        });
    }

    /**
     * Bootstrap routing
     *
     * @return void
     */
    protected function bootRouting()
    {
        $app = $this->app;
        $locales = $this->getLocales();

        // Set locale when route is matched
        $this->app['events']->listen(RouteMatched::class, function (RouteMatched $event) use (
            $locales
        ) {
            $locale = $this->app->getLocale();
            $action = $event->route->getAction();
            // prettier-ignore
            if (isset($action['locale']) &&
                $action['locale'] !== $locale &&
                in_array($action['locale'], $locales)
            ) {
                $this->app->setLocale($action['locale']);
            }
        });

        Request::macro('locale', function () {
            return app()->getLocale();
        });
    }
}
