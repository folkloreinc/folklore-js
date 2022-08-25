<?php

namespace App\Contracts\Repositories;

use Folklore\Contracts\Repositories\Pages as BasePages;
use App\Contracts\Resources\Page as PageResource;

interface Pages extends BasePages
{
    public function findById(string $id): ?PageResource;

    public function findByHandle(string $handle): ?PageResource;

    public function findBySlug(string $slug, string $locale = null): ?PageResource;

    public function create(array $data): PageResource;

    public function update(string $id, array $data): ?PageResource;
}
