<?php

namespace App\Contracts\Repositories;

use App\Contracts\Resources\User as UserResource;
use Illuminate\Contracts\Auth\UserProvider;
use Panneau\Contracts\Repository as PanneauRepository;
use Laravel\Socialite\Contracts\User as SocialiteUser;

interface Users extends Repository, UserProvider, PanneauRepository
{
    public function findById(string $id): ?UserResource;

    public function findByName(string $name): ?UserResource;

    public function findByEmail(string $email): ?UserResource;

    public function findBySocialiteUser(string $provider, SocialiteUser $user): ?UserResource;

    public function get(array $query = [], ?int $page = null, ?int $count = 10);

    public function create(array $data): UserResource;

    public function createFromSocialiteUser(
        string $provider,
        SocialiteUser $user,
        array $data = []
    ): UserResource;

    public function update(string $id, array $data): ?UserResource;

    public function updateFromSocialiteUser(
        string $id,
        string $provider,
        SocialiteUser $user
    ): ?UserResource;

    public function destroy(string $id): bool;

    public function connectUser(UserResource $user);
}
