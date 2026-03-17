<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        if (!$request->expectsJson() && $request->isPanneau()) {
            return route('panneau.auth.login') .
                '?' .
                http_build_query([
                    'next' => $request->fullUrl(),
                ]);
        }

        return route('login') .
            http_build_query([
                'next' => $request->fullUrl(),
            ]);
    }
}
