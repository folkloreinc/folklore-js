<?php

namespace App\Models;

use App\Contracts\Entities\Page as PageContract;
use App\Entities\Page as PageResource;
use Folklore\Models\Page as BasePage;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Page extends BasePage
{
    use HasFactory;

    protected $entitiesByType = [
        'home' => \App\Resources\Pages\HomePage::class,
    ];

    public function toResource(): PageContract
    {
        return $this->toTypedEntity() ?? new PageResource($this);
    }

    public function blocks()
    {
        return $this->morphToMany(Block::class, 'blockable', 'blocks_pivot');
    }
}
