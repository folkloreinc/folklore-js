<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Request;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Schema::defaultStringLength(191);
        JsonResource::withoutWrapping();

        // Determine site from request
        Request::macro('site', function () {
            return null;
        });
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->registerRepositories();
    }

    protected function registerRepositories()
    {
        $this->app->bind(
            \Folklore\Contracts\Repositories\Users::class,
            \App\Repositories\Users::class
        );

        $this->app->bind(
            \App\Contracts\Repositories\Users::class,
            \App\Repositories\Users::class
        );
    }
}
