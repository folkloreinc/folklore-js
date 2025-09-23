<?php

namespace App\Models;

use App\Contracts\Entities\Block as BlockContract;
use App\Entities\Block as BlockResource;
use Folklore\Models\Block as BaseBlock;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Block extends BaseBlock
{
    use HasFactory;

    protected $entitiesByType = [
        'text' => \App\Entities\Blocks\TextBlock::class,
        'image' => \App\Entities\Blocks\ImageBlock::class,
    ];

    public function toResource(): BlockContract
    {
        return $this->toTypedEntity() ?? new BlockResource($this);
    }
}
