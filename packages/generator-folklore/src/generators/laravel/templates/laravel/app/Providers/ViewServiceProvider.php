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

        $view->composer('errors::404', function (View $view) {
            $view->with('props', [
                'statusCode' => 404,
            ]);
        });

        $view->composer('errors::500', function (View $view) {
            $view->with('props', [
                'statusCode' => 500,
            ]);
        });

        $reactPages = ['page', 'errors::404', 'errors::500'];
        $view->composer($reactPages, \App\Composers\TranslationsComposer::class);
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
