<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Arr;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Providers\Concerns\RegistersFromConfig;
use Carbon\Carbon;

class AppServiceProvider extends ServiceProvider
{
    use RegistersFromConfig;

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->registerMixins();
        $this->registerRepositories();
        $this->registerMediatheque();
    }

    protected function registerMixins()
    {
        if ($this->app->environment('local')) {
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            $this->app->register(TelescopeServiceProvider::class);
        }

        $this->app->bind(\App\Routing\RouterMixin::class, function () {
            return new \App\Routing\RouterMixin(
                $this->app,
                $this->app['translator'],
                $this->app['config']->get('locale.locales')
            );
        });

        $this->app->bind(\App\Routing\UrlGeneratorMixin::class, function () {
            return new \App\Routing\UrlGeneratorMixin($this->app['router']);
        });
    }

    protected function registerRepositories()
    {
        $this->app->bind(
            \App\Contracts\Repositories\Medias::class,
            \App\Repositories\MediasRepository::class
        );

        $this->app->bind(
            \App\Contracts\Repositories\Users::class,
            \App\Repositories\UsersRepository::class
        );

        $this->app->bind(
            \App\Contracts\Repositories\Pages::class,
            \App\Repositories\PagesRepository::class
        );

        $this->app->bind(
            \App\Contracts\Repositories\Blocks::class,
            \App\Repositories\BlocksRepository::class
        );
    }

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
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Schema::defaultStringLength(191);
        JsonResource::withoutWrapping();

        $this->bootImageSizes();
        $this->bootMacros();
    }

    protected function bootImageSizes()
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
            if (isset($filter['width']) && isset($filter['width'])) {
                $newFilter['crop'] = true;
            }
            $this->app['image']->filter($id, $newFilter);
        }
    }

    protected function bootMacros()
    {
        \Illuminate\Routing\Router::macro(
            'authWithLocales',
            $this->app->make(\App\Routing\RouterMixin::class)->authWithLocales()
        );

        \Illuminate\Routing\UrlGenerator::macro(
            'routeForReactRouter',
            $this->app->make(\App\Routing\UrlGeneratorMixin::class)->routeForReactRouter()
        );

        // This macro is always available and overriden in middlewares for preview mode
        \Illuminate\Http\Request::macro('edition', function () {
            $previewId = session()->get('preview_edition');
            $repository = app()->make(\App\Repositories\EditionsRepository::class);
            if (isset($previewId) && !empty($previewId)) {
                return $repository->findById($previewId);
            }
            return $repository->findActive();
        });
    }
}
