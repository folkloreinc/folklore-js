<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\View\Factory as ViewFactory;

class ViewServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $view = $this->app[ViewFactory::class];
        $view->composer('app', \App\Composers\IntlComposer::class);
        $view->composer('app', \App\Composers\RoutesComposer::class);
        $view->composer('app', \App\Composers\AppComposer::class);
        $view->composer('meta.*', \App\Composers\MetaComposer::class);
    }
}
