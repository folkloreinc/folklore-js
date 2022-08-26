<?php

namespace App\Contracts\Repositories;

use Folklore\Contracts\Repositories\Users as BaseUsers;
use App\Contracts\Resources\User as UserResource;

interface Users extends BaseUsers
{
    public function findById(string $id): ?UserResource;

    public function findByEmail(string $email): ?UserResource;

    public function create($data): UserResource;

    public function update(string $id, $data): ?UserResource;
}
