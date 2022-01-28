<?php

use Illuminate\Support\Facades\Route;

// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Http;

use App\Http\Controllers\HomeController;

Route::get('/', [HomeController::class, 'redirect'])
    ->middleware('web')
    ->name('home.redirect');

foreach (config('locale.locales') as $locale) {
    Route::get('/' . $locale . '.json', [HomeController::class, 'show'])
        ->locale($locale)
        ->nameWithLocale('home.json');
}

Route::groupWithLocales(
    [
        'middleware' => 'web',
    ],
    function ($locale) {
        Route::get('/', [HomeController::class, 'show'])->nameWithLocale('home');
    }
);
