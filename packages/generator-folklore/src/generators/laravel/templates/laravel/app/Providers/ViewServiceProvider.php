<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Blade;
use Illuminate\Contracts\View\Factory as ViewFactory;

class ViewServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->bootComposers();
    }

    public function bootShare()
    {
    }

    public function bootComposers()
    {
        $view = $this->app[ViewFactory::class];
        if ($this->app->environment() !== 'production') {
            $view->composer(
                ['app', 'errors::*', 'panneau::layout', 'panneau::app'],
                \App\View\Composers\DevComposer::class
            );
        }

        // TOD: add isPanneau
        // $view->composer(
        //     ['panneau::layout', 'panneau::app'],
        //     \App\View\Composers\PanneauComposer::class
        // );

        $view->composer(['meta.*'], \App\View\Composers\MetaComposer::class);
        $view->composer(['analytics.*'], \App\View\Composers\AnalyticsComposer::class);
        $view->composer(['errors::*'], \App\View\Composers\ErrorsComposer::class);
        $view->composer(['app', 'errors::*'], \App\View\Composers\TranslationsComposer::class);
        $view->composer(['app', 'errors::*'], \App\View\Composers\RoutesComposer::class);
        $view->composer(['app', 'errors::*'], \App\View\Composers\EditionsComposer::class);
        $view->composer(['app', 'errors::*'], \App\View\Composers\MenusComposer::class);
        $view->composer(['app', 'errors::*'], \App\View\Composers\KeysComposer::class);
        $view->composer(['app', 'errors::*'], \App\View\Composers\AppComposer::class);
        $view->composer('tags.*', \App\View\Composers\TagsComposer::class);
    }
}
