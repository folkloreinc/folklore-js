<?php

namespace App\Contracts\Blocks;

use Panneau\Contracts\ResourceItem;
use App\Contracts\Resources\Resource;

interface Block extends Resource, ResourceItem
{
    public function id(): string;
    public function type(): string;
}
