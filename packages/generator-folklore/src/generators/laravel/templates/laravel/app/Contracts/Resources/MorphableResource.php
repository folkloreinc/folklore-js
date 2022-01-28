<?php

namespace App\Contracts\Resources;

use Panneau\Contracts\ResourceItem;

interface MorphableResource extends Resource, ResourceItem
{
    public function morphableType(): string;
}
