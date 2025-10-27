<?php

namespace App\Entities;

use App\Contracts\Entities\User as UserContract;
use Folklore\Entities\User as BaseUser;

class User extends BaseUser implements UserContract
{
}
