<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Folklore\Models\User as BaseUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use App\Contracts\Resources\User as UserContract;
use App\Resources\User as UserResource;

class User extends BaseUser
{
    use HasApiTokens, HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function toResource(): UserContract
    {
        return new UserResource($this);
    }
}
