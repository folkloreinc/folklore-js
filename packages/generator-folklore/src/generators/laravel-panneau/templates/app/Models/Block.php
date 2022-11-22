<?php

namespace App\Models;

use App\Contracts\Resources\Block as BlockContract;
use App\Resources\Block as BlockResource;
use Folklore\Models\Block as BaseBlock;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Block extends BaseBlock
{
    use HasFactory;

    protected $typeResources = [
        'text' => \App\Resources\Blocks\TextBlock::class,
        'image' => \App\Resources\Blocks\ImageBlock::class,
    ];

    public function toResource(): BlockContract
    {
        return $this->toTypedResource() ?? new BlockResource($this);
    }
}
