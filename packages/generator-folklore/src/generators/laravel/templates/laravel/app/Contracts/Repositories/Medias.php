<?php

namespace App\Contracts\Repositories;

use App\Contracts\Medias\Media;
use Panneau\Contracts\Repository as PanneauRepository;
use Symfony\Component\HttpFoundation\File\File;

interface Medias extends Repository, PanneauRepository
{
    public function findById(string $id): ?Media;

    public function findByName(string $name): ?Media;

    public function findByPath(string $path): ?Media;

    public function create(array $data): Media;

    public function createFromFile(File $file, array $data = []): ?Media;

    public function createFromPath(string $path, array $data = []): ?Media;

    public function update(string $id, array $data): ?Media;
}
