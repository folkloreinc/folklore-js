<?php

namespace App\Panneau\Http\Resources;

use Folklore\Http\Resources\Collection;

class BlocksCollection extends Collection
{
    public $collects = BlockResource::class;
}
