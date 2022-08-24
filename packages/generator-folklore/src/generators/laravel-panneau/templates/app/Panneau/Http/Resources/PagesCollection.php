<?php

namespace App\Panneau\Http\Resources;

use Folklore\Http\Resources\Collection;

class PagesCollection extends Collection
{
    public $collects = PageResource::class;
}
