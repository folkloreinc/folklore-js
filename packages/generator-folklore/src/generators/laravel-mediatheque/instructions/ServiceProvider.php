<?php

class AppServiceProvider extends ServiceProvider
{
    //...
    public function register()
    {
        // ...

        $this->registerMediatheque();
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
    //...
}
