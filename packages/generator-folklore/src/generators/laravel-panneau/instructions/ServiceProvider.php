<?php

class AppServiceProvider extends ServiceProvider
{
    //...
    protected function registerRepositories()
    {
        //...

        $this->app->bind(
            \Folklore\Contracts\Repositories\Pages::class,
            \App\Repositories\Pages::class
        );

        $this->app->bind(
            \App\Contracts\Repositories\Pages::class,
            \App\Repositories\Pages::class
        );
    }
    //...
}
