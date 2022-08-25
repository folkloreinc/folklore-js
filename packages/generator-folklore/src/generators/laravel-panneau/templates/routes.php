<?php

use Illuminate\Support\Facades\Route;
use Panneau\Support\Facade as Panneau;

Panneau::router()->group(function () {
    $namePrefix = config('panneau.routes.name_prefix', config('panneau.routes.prefix') . '.');

    Route::any('tus/{any?}', function () {
        return app('tus-server')->serve();
    })->where('any', '.*');

    Panneau::router()->auth();

    Route::namespace('\App\Panneau\Http\Controllers')
        ->middleware(['web', 'auth', 'can:view,' . \Panneau\Panneau::class])
        ->group(function () use ($namePrefix) {
            Route::get('/', 'HomeController@index')->name($namePrefix . 'home');

            Route::post('upload', 'UploadController@upload')->name($namePrefix . 'upload');

            // Account
            Route::get('account', 'AccountController@index')->name($namePrefix . 'account');
            Route::post('account', 'AccountController@update')->name(
                $namePrefix . 'account.update'
            );

            Panneau::router()->resources();
        });
});
