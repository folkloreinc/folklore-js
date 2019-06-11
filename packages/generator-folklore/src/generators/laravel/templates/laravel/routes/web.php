<?php

//Redirect to current langage home
Route::get('/', 'HomeController@redirect')->name('home');

Route::groupWithLocales(function () {
    Route::getLocalized('/', 'HomeController@index')->nameWithLocale('home');
    Route::getLocalized('/test', 'HomeController@index')->nameWithLocale('test');
    Route::getLocalized('/test/{with_param}', 'HomeController@index')->nameWithLocale('test_with_param');
});
