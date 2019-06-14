<?php

namespace App\Policies;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PanneauPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can acces to panneau
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function view(User $user)
    {
        return $user->can('view-panneau');
    }

    /**
     * Determine whether the user edit settings in panneau
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function settings(User $user)
    {
        return $user->can('settings-panneau');
    }
}
