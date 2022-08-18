<?php

//Redirect to current langage home
Route::get('/', 'HomeController@redirect')->name('home');

Route::groupWithLocales(function () {
    Route::getTrans('/', 'HomeController@index')->nameWithLocale('home');
    Route::getTrans('/test', 'HomeController@index')->nameWithLocale('test');
    Route::getTrans('/test/{with_param}', 'HomeController@index')->nameWithLocale('test_with_param');
});
