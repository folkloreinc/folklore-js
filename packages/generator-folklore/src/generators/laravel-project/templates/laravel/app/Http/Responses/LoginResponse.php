<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Fortify;
use App\Http\Resources\UserResource;
use App\Panneau\Http\Resources\UserResource as PanneauUserResource;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function toResponse($request)
    {
        if ($request->wantsJson()) {
            return $request->isPanneau()
                ? new PanneauUserResource($request->user())
                : new UserResource($request->participant());
        }
        return redirect()->intended(Fortify::redirects('login'));
    }
}
