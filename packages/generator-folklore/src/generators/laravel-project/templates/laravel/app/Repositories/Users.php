<?php

namespace App\Repositories;

use Folklore\Repositories\Users as BaseUsers;
use Illuminate\Database\Eloquent\Model;
use App\Models\User as UserModel;
use App\Contracts\Resources\User as UserContract;

class Users extends BaseUsers
{
    protected function newModel(): Model
    {
        return new UserModel();
    }

    public function findById(string $id): ?UserContract
    {
        return parent::findById($id);
    }

    public function findByEmail(string $email): ?UserContract
    {
        return parent::findByEmail($email);
    }

    public function create($data): UserContract
    {
        return parent::create($data);
    }

    public function update(string $id, $data): ?UserContract
    {
        return parent::update($id, $data);
    }
}
