<?php

namespace App\Composers;

use Illuminate\View\View;
use Illuminate\Http\Request;
use Illuminate\Routing\Router;
use Folklore\Composers\RoutesComposer as BaseRoutesComposer;

class RoutesComposer extends BaseRoutesComposer
{
    protected $routes = [];

    protected $routesLocalized = [
        'home',
        'sections.show',
        'prizes.show',
        'prizes.show.json',
        'prizes.redeem',
    ];

    protected $withoutParametersPatterns = true;
}
