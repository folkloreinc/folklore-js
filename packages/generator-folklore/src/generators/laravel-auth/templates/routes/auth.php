<?php

use Illuminate\Support\Facades\Route;

Route::groupWithLocales(function ($locale) {
    // Authentication Routes...
    Route::getLocalized('login', 'LoginController@showLoginForm')->nameWithLocale('auth.login');
    Route::postLocalized('login', 'LoginController@login');
    Route::getLocalized('logout', 'LoginController@logout')->nameWithLocale('auth.logout');

    // Reset password
    Route::getLocalized(
        'password/reset',
        'ForgotPasswordController@showLinkRequestForm'
    )->nameWithLocale('auth.password.request');
    Route::postLocalized(
        'password/email',
        'ForgotPasswordController@sendResetLinkEmail'
    )->nameWithLocale('auth.password.email');
    Route::getLocalized(
        'password/reset/{token}',
        'ResetPasswordController@showResetForm'
    )->nameWithLocale('auth.password.reset');
    Route::postLocalized('password/reset', 'ResetPasswordController@reset')->nameWithLocale(
        'auth.password.update'
    );

    // Email Verification
    Route::getLocalized('verify', 'VerificationController@show')->nameWithLocale(
        'auth.verification.notice'
    );
    Route::getLocalized('verify/resend', 'VerificationController@resend')->nameWithLocale(
        'auth.verification.resend'
    );
    Route::getLocalized('verify/{id}', 'VerificationController@verify')->nameWithLocale(
        'auth.verification.verify'
    );
});
