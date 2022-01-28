<?php

namespace App\Contracts\Medias;

use App\Contracts\Resources\Resource;
use Panneau\Contracts\ResourceItem;
use Illuminate\Support\Collection;

interface Media extends Resource, ResourceItem
{
    public function url(): string;

    public function metadata(): MediaMetadata;

    public function thumbnailUrl(): ?string;

    public function files(): Collection;
}
