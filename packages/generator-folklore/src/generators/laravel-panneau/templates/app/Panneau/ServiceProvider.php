<?php

namespace App\Panneau;

use Illuminate\Support\ServiceProvider as BaseServiceProvider;
use Illuminate\Contracts\View\Factory as ViewFactory;
use Illuminate\Support\Facades\Gate;
use Panneau\Support\LocalizedField;
use Panneau\Support\Facade as Panneau;

class PanneauServiceProvider extends BaseServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        Gate::policy(\Panneau\Panneau::class, \App\Panneau\Policies\PanneauPolicy::class);
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        LocalizedField::setLocalesResolver(function () {
            return config('locale.locales');
        });

        $this->bootViews();
    }

    protected function bootViews()
    {
        $view = $this->app[ViewFactory::class];

        // Panneau
        $view->composer('panneau::app', \App\Panneau\Composers\AppComposer::class);

        Panneau::serving(function () use ($view) {
            $view->composer('errors::*', \App\Panneau\Composers\AppComposer::class);
        });
    }
}
