<?php

namespace App\Models;

use App\Contracts\Resources\Page as PageContract;
use App\Resources\Page as PageResource;
use Folklore\Models\Page as BasePage;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Page extends BasePage
{
    use HasFactory;

    protected $typedResources = [
        'home' => \App\Resources\Pages\HomePage::class,
    ];

    public function toResource(): PageContract
    {
        return $this->toTypedResource() ?? new PageResource($this);
    }

    public function blocks()
    {
        return $this->morphToMany(Block::class, 'blockable', 'blocks_pivot');
    }
}
