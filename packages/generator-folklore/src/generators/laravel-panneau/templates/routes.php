<?php

use Illuminate\Support\Facades\Route;
use Panneau\Support\Facade as Panneau;
use App\Panneau\Http\Controllers\HomeController;
use App\Panneau\Http\Controllers\UploadController;

Panneau::router()->group(function () {
    $namePrefix = config('panneau.routes.name_prefix', config('panneau.routes.prefix') . '.');

    Route::any('tus/{any?}', function () {
        return app('tus-server')->serve();
    })->where('any', '.*');

    Route::middleware(['web'])->group(function () {
        Panneau::router()->auth();
    });

    Route::middleware(['web', 'auth', 'can:view,' . \Panneau\Panneau::class])->group(
        function () use ($namePrefix) {
            Route::get('/', [HomeController::class, 'index'])->name($namePrefix . 'home');

            Route::post('upload', [UploadController::class, 'upload'])->name(
                $namePrefix . 'upload'
            );

            Panneau::router()->resources();
        }
    );
});
