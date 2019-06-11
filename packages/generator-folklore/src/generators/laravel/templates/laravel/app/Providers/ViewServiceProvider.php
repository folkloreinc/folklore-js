<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class ViewServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $view = $this->app['view'];
        $view->composer('layouts.main', \App\Composers\Layouts\MainComposer::class);

        $reactPages = ['root', 'errors::401', 'errors::403', 'errors::404', 'errors::500'];
        $view->composer($reactPages, \App\Composers\ErrorsComposer::class);
        $view->composer($reactPages, \App\Composers\TranslationsComposer::class);
        $view->composer($reactPages, \App\Composers\MetaComposer::class);
        $view->composer($reactPages, \App\Composers\RoutesComposer::class);
        $view->composer($reactPages, \App\Composers\RootComposer::class);
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
