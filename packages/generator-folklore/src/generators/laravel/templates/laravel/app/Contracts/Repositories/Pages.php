<?php

namespace App\Contracts\Repositories;

use Illuminate\Support\Collection;
use Panneau\Contracts\Repository as PanneauRepository;
use App\Contracts\Resources\Page as PageResource;
use App\Contracts\Resources\Edition;

interface Pages extends Slugs, Repository, PanneauRepository
{
    public function findById(string $id): ?PageResource;

    public function findByHandle(string $handle): ?PageResource;

    public function findByEditionAndHandle(Edition $edition, string $handle): ?PageResource;

    public function findByIndexHandle(string $handle): ?PageResource;

    public function findBySlug(string $slug, string $locale = null): ?PageResource;

    public function findByParentAndSlug(
        PageResource $parent,
        string $slug,
        string $locale = null
    ): ?PageResource;

    public function findEdition(Edition $edition): ?PageResource;

    public function get(array $query = [], ?int $page = null, ?int $count = 10);

    public function getSections(): Collection;

    public function getIndexes(): Collection;

    public function create(array $data): PageResource;

    public function update(string $id, array $data): ?PageResource;

    public function destroy(string $id): bool;
}
