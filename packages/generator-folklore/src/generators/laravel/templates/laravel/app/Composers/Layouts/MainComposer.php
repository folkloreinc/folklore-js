<?php

namespace App\Composers\Layouts;

use Illuminate\View\View;

class MainComposer
{
    public function compose(View $view)
    {
        $view->analyticsId = config('services.google.analytics_id');
        $view->tagManagerId = config('services.google.tagmanager_id');
    }
}
