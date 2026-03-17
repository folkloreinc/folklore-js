<?php

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\RouteServiceProvider::class,
    App\Providers\ViewServiceProvider::class,
    App\Providers\FortifyServiceProvider::class,<% if (options.panneau) { %>
    App\Panneau\PanneauServiceProvider::class,<% } %>
];
