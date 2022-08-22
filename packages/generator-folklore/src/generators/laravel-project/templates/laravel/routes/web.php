<?php

use App\Http\Controllers\HomeController;

//Redirect to current langage home
Route::get('/', [HomeController::class, 'redirect'])->name('home');

Route::groupWithLocales(function () {
    Route::getTrans('/', [HomeController::class, 'index'])->nameWithLocale('home');
    Route::getTrans('/test', [HomeController::class, 'index'])->nameWithLocale('test');
    Route::getTrans('/test/{with_param}', [HomeController::class, 'index'])->nameWithLocale('test_with_param');
});
