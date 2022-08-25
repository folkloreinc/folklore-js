<?php

namespace App\Panneau\Policies;

use Illuminate\Auth\Access\HandlesAuthorization;
use App\Contracts\Resources\User;

class PanneauPolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if panneau can be viewed by the user.
     *
     * @param  \App\User  $user
     * @return bool
     */
    public function view(User $user)
    {
        return $user->role() === 'admin';
    }
}
