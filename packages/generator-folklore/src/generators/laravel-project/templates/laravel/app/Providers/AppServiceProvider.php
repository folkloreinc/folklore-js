<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->registerRepositories();<% if (options.mediatheque) { %>
        $this->registerMediatheque();<% } %>
        $this->registerTelescope();
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
        );<% if (options.panneau) { %>

        $this->app->bind(
            \Folklore\Contracts\Repositories\Pages::class,
            \App\Repositories\Pages::class
        );

        $this->app->bind(
            \App\Contracts\Repositories\Pages::class,
            \App\Repositories\Pages::class
        );<% } %>
    }<% if (options.mediatheque) { %>

    protected function registerMediatheque()
    {
        $this->app->bind(
            \Folklore\Mediatheque\Contracts\Models\Media::class,
            \App\Models\Media::class
        );

        $this->app->bind(
            \Folklore\Mediatheque\Contracts\Models\File::class,
            \App\Models\MediaFile::class
        );
    }<% } %>

    protected function registerTelescope()
    {
        if ($this->app->environment('local')) {
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            $this->app->register(TelescopeServiceProvider::class);
        }
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // Some defaults
        Schema::defaultStringLength(191);
        JsonResource::withoutWrapping();

        $this->bootRequest();

        $this->bootImage();
    }

    protected function bootRequest()
    {
        // Determine site from request
        Request::macro('site', function () {
            return null;
        });
    }

    protected function bootImage()
    {
        foreach (config('image.sizes') as $filter) {
            $id = $filter['id'];
            $data = Arr::except($filter, ['id']);
            if (sizeof($data) === 0) {
                continue;
            }
            $newFilter = [];
            if (isset($filter['maxWidth'])) {
                $newFilter['width'] = $filter['maxWidth'];
            }
            if (isset($filter['maxHeight'])) {
                $newFilter['height'] = $filter['maxHeight'];
            }
            if (isset($filter['width'])) {
                $newFilter['width'] = $filter['width'];
            }
            if (isset($filter['height'])) {
                $newFilter['height'] = $filter['height'];
            }
            if (isset($filter['width']) && isset($filter['height'])) {
                $newFilter['crop'] = true;
            }
            $this->app['image']->filter($id, $newFilter);
        }
    }
}
