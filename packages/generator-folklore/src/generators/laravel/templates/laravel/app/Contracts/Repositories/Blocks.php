<?php

namespace App\Contracts\Repositories;

use Panneau\Contracts\Repository as PanneauRepository;
use App\Contracts\Blocks\Block as BlockResource;

interface Blocks extends Repository, PanneauRepository
{
    public function findById(string $id): ?BlockResource;

    public function findByHandle(string $handle): ?BlockResource;

    public function get(array $query = [], ?int $page = null, ?int $count = 10);

    public function create(array $data): BlockResource;

    public function update(string $id, array $data): ?BlockResource;

    public function destroy(string $id): bool;
}
