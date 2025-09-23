<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Folklore\Models\User as BaseUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use App\Contracts\Entities\User as UserContract;
use App\Entities\User as UserResource;

class User extends BaseUser
{
    use HasApiTokens, HasFactory;

    public function toResource(): UserContract
    {
        return new UserResource($this);
    }
}
