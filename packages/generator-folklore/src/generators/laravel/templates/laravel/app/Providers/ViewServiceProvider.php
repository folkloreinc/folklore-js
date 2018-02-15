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
        $view->composer(['react'], \App\Composers\ReactComposer::class);
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
