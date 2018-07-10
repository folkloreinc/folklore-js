<?php

namespace App\Providers;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class PanneauServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(\Folklore\Panneau\Contracts\Page::class, \App\Models\Page::class);
        $this->app->bind(\Folklore\Panneau\Contracts\Block::class, \App\Models\Block::class);
        $this->app->bind(\Folklore\Mediatheque\Contracts\Models\Video::class, \App\Models\Mediatheque\Video::class);
        $this->app->bind(\Folklore\Mediatheque\Contracts\Models\Picture::class, \App\Models\Mediatheque\Picture::class);
        $this->app->bind(\Folklore\Mediatheque\Contracts\Models\File::class, \App\Models\Mediatheque\File::class);
    }
}
