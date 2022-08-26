<?php

namespace App\Panneau\Http\Resources;

use Folklore\Http\Resources\Collection;

class UsersCollection extends Collection
{
    public $collects = UserResource::class;
}
