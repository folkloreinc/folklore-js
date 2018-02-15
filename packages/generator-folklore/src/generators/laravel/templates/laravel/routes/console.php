<?php

use Illuminate\Foundation\Inspiring;

//Db Install
Artisan::command('db:install {--force}', function () {
    $args = [];
    if ($this->option('force')) {
        $args['--force'] = true;
    }
    Artisan::call('migrate', $args);
    Artisan::call('db:seed', $args);
})->describe('Install database');

//DB reset
Artisan::command('db:reset {--force}', function () {
    $args = [];
    if ($this->option('force')) {
        $args['--force'] = true;
    }
    Artisan::call('migrate:reset', $args);
    Artisan::call('migrate', $args);
    Artisan::call('db:seed', $args);
})->describe('Reset database');
