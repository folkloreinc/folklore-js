<?php

namespace App\Routing;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Translation\Translator;
use App\Support\AttachToMacroable;

class RouterMixin
{
    use AttachToMacroable;

    protected $app;

    protected $translator;

    protected $locales;

    public function __construct(Application $app, Translator $translator, $locales)
    {
        $this->app = $app;
        $this->translator = $translator;
        $this->locales = $locales;
    }

    // public function nameWithLocale()
    // {
    //     $app = $this->app;
    //     return function ($name, $locale = null) use ($app) {
    //         if (is_null($locale)) {
    //             $locale = $app->getLocale();
    //         }
    //         return $locale . '.' . $name;
    //     };
    // }
    //
    // public function locale()
    // {
    //     return function ($locale) {
    //         $this->mergeWithLastGroup([
    //             'locale' => $locale,
    //         ]);
    //         return $this;
    //     };
    // }

    // public function groupWithLocales()
    // {
    //     $locales = $this->locales;
    //     return function ($callback, $action = []) use ($locales) {
    //         $originalAction = $action;
    //         $action = is_array($callback) ? $callback : $action;
    //         $callback = is_array($callback) ? $originalAction : $callback;
    //         $prefix = isset($action['prefix']) ? '/' . $action['prefix'] : '';
    //         foreach ($locales as $locale) {
    //             $groupAction = array_merge($action, [
    //                 'prefix' => $locale . $prefix,
    //                 'locale' => $locale,
    //             ]);
    //             $this->group($groupAction, function () use ($locale, $callback) {
    //                 $callback($locale);
    //             });
    //         }
    //         return $this;
    //     };
    // }

    public function authWithLocales()
    {
        return function ($options = []) {
            $this->groupWithLocales(
                [
                    'namespace' => data_get($options, 'namespace', '\App\Http\Controllers\Auth'),
                    'prefix' => data_get($options, 'prefix'),
                ],
                function () use ($options) {
                    $namePrefix = data_get($options, 'name_prefix', null);
                    $namePrefix = !empty($namePrefix) ? $namePrefix . '.' : '';

                    // Login/logout
                    $this->getTrans('login', 'LoginController@showLoginForm')
                        ->middleware('web')
                        ->nameWithLocale($namePrefix . 'login');

                    $this->postTrans('login', 'LoginController@login')
                        ->middleware('web')
                        ->nameWithLocale($namePrefix . 'login.post');

                    $this->postTrans('logout', 'LoginController@logout')
                        ->middleware('web')
                        ->nameWithLocale($namePrefix . 'logout');

                    // Register
                    if (data_get($options, 'register', true)) {
                        $this->getTrans('register', 'RegisterController@showRegistrationForm')
                            ->middleware('web')
                            ->nameWithLocale($namePrefix . 'register');
                        $this->postTrans('register', 'RegisterController@register')
                            ->middleware('web')
                            ->nameWithLocale($namePrefix . 'register.post');
                    }

                    // Password
                    $this->getTrans(
                        'password/reset',
                        'ForgotPasswordController@showLinkRequestForm'
                    )
                        ->middleware('web')
                        ->nameWithLocale($namePrefix . 'password.request');

                    $this->postTrans(
                        'password/email',
                        'ForgotPasswordController@sendResetLinkEmail'
                    )
                        ->middleware('web')
                        ->nameWithLocale($namePrefix . 'password.email');
                    $this->getTrans(
                        'password/reset/{token}',
                        'ResetPasswordController@showResetForm'
                    )
                        ->middleware('web')
                        ->nameWithLocale($namePrefix . 'password.reset');
                    $this->postTrans('password/reset', 'ResetPasswordController@reset')
                        ->middleware('web')
                        ->nameWithLocale($namePrefix . 'password.update');

                    // Confirm
                    $this->getTrans('password/confirm', 'ConfirmPasswordController@showConfirmForm')
                        ->middleware('web')
                        ->nameWithLocale($namePrefix . 'password.confirm');
                    $this->postTrans('password/confirm', 'ConfirmPasswordController@confirm')
                        ->middleware('web')
                        ->nameWithLocale($namePrefix . 'password.confirm.post');

                    // Verification
                    $this->getTrans('email/verify', 'VerificationController@show')
                        ->middleware('web')
                        ->nameWithLocale($namePrefix . 'verification.notice');
                    $this->getTrans('email/verify/{id}/{hash}', 'VerificationController@verify')
                        ->middleware('web')
                        ->nameWithLocale($namePrefix . 'verification.verify');
                    $this->postTrans('email/resend', 'VerificationController@resend')
                        ->middleware('web')
                        ->nameWithLocale($namePrefix . 'verification.resend');
                }
            );
        };
    }

    // public function addRouteTrans()
    // {
    //     $app = $this->app;
    //     $translator = $this->translator;
    //
    //     return function ($methods, $uri, $action = null, $locale = null) use ($app, $translator) {
    //         if (is_null($locale)) {
    //             if ($this->hasGroupStack()) {
    //                 $groupStack = $this->getGroupStack();
    //                 $locale = data_get(end($groupStack), 'locale', $app->getLocale());
    //             } else {
    //                 $locale = $app->getLocale();
    //             }
    //         }
    //         $uri = $translator->has('routes.' . $uri, $locale)
    //             ? $translator->get('routes.' . $uri, [], $locale)
    //             : $uri;
    //         return $this->addRoute((array) $methods, $uri, $action);
    //     };
    // }
    //
    // public function getTrans()
    // {
    //     return function ($uri, $action = null, $locale = null) {
    //         return $this->addRouteTrans(['GET', 'HEAD'], $uri, $action, $locale);
    //     };
    // }
    //
    // public function postTrans()
    // {
    //     return function ($uri, $action = null, $locale = null) {
    //         return $this->addRouteTrans('POST', $uri, $action, $locale);
    //     };
    // }
    //
    // public function putTrans()
    // {
    //     return function ($uri, $action = null, $locale = null) {
    //         return $this->addRouteTrans('PUT', $uri, $action, $locale);
    //     };
    // }
    //
    // public function patchTrans()
    // {
    //     return function ($uri, $action = null, $locale = null) {
    //         return $this->addRouteTrans('PATCH', $uri, $action, $locale);
    //     };
    // }
    //
    // public function deleteTrans()
    // {
    //     return function ($uri, $action = null, $locale = null) {
    //         return $this->addRouteTrans('DELETE', $uri, $action, $locale);
    //     };
    // }
    //
    // public function optionsTrans()
    // {
    //     return function ($uri, $action = null, $locale = null) {
    //         return $this->addRouteTrans('OPTIONS', $uri, $action, $locale);
    //     };
    // }
    //
    // public function resourceTrans()
    // {
    //     $app = $this->app;
    //     $translator = $this->translator;
    //
    //     return function ($name, $controller, $locale = null) use ($app, $translator) {
    //         if (is_null($locale)) {
    //             if ($this->hasGroupStack()) {
    //                 $groupStack = $this->getGroupStack();
    //                 $locale = data_get(end($groupStack), 'locale', $app->getLocale());
    //             } else {
    //                 $locale = $app->getLocale();
    //             }
    //         }
    //         $localizedName = $translator->has('routes.' . $name, $locale)
    //             ? $translator->get('routes.' . $name, [], $locale)
    //             : $name;
    //         $names = $this->nameWithLocale($name, $locale);
    //         return $this->resource($localizedName, $controller)
    //             ->names($names)
    //             ->parameters([
    //                 $localizedName => $name,
    //             ]);
    //     };
    // }
}
