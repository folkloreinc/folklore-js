<?php

//Redirect to current langage home
Route::get('/', [
    'as' => 'home',
    'uses' => 'HomeController@redirect'
]);

$locales = config('locale.locales');
foreach ($locales as $locale) {
    Route::group([
        'prefix' => $locale,
        'locale' => $locale
    ], function () use ($locale) {
        Route::get('/', [
            'as' => 'home.'.$locale,
            'uses' => 'HomeController@index'
        ]);

        Route::get(trans('routes.test', [], $locale), [
            'as' => 'test.'.$locale,
            'uses' => 'HomeController@index'
        ]);

        Route::get(trans('routes.test_with_param', ['slug'], $locale), [
            'as' => 'test_with_param.'.$locale,
            'uses' => 'HomeController@index'
        ]);
    });
}
