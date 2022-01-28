<?php

namespace App\Contracts\Medias;

use App\Contracts\Resources\Resource;
use Panneau\Contracts\ResourceItem;

interface MediaFile extends ResourceItem, Resource
{
    public function id(): string;

    public function url(): string;

    public function handle(): ?string;
}
