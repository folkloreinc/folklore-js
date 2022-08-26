<?php

namespace App\Models;

use Folklore\Models\Block as BaseBlock;

class Block extends BaseBlock
{
    protected $typeResources = [
        'text' => \App\Resources\Blocks\TextBlock::class,
        'image' => \App\Resources\Blocks\ImageBlock::class,
    ];
}
