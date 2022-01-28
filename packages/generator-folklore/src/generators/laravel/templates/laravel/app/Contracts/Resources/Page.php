<?php

namespace App\Contracts\Resources;

use Illuminate\Support\Collection;
use Panneau\Contracts\ResourceItem;

interface Page extends Resource, ResourceItem, Pageable, HasBlocks
{
    public function handle(): ?string;

    public function slug(string $locale): ?string;

    public function title(string $locale): string;

    public function inHeader(): bool;

    public function edition(): ?Edition;

    public function parent(): ?Page;

    public function children(): Collection;

    public function published(): bool;
}
