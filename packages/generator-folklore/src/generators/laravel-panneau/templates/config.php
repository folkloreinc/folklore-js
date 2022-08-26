<?php

return [
    'intl' => [
        'locale' => 'fr',
        'locales' => ['fr', 'en'],
        'translations' => ['panneau::resources', 'panneau'],
    ],

    'resources' => [
        \App\Panneau\Resources\Blocks::class,
        \App\Panneau\Resources\Pages::class,
        \App\Panneau\Resources\Users::class,
    ],

    'routes' => [
        // Path to the routes file that will be automatically loaded. Set to null
        // to prevent auto-loading of routes.
        'map' => base_path('routes/panneau.php'),

        'prefix' => 'panneau',

        'middleware' => [\Panneau\Http\Middleware\DispatchHandlingRequestEvent::class],

        'custom' => [],

        'without_patterns' => true,
    ],
];
