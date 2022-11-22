<?php

namespace App\Http\Resources;

use Folklore\Http\Resources\Collection;

class BlocksCollection extends Collection
{
    public $collects = BlockResource::class;
}
