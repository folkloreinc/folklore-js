<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Contracts\Resources\Page;
use App\Contracts\Resources\Pages\Home as HomePage;
use Folklore\Http\Resources\MediaResource;
use Folklore\Contracts\Resources\HasBlocks;

class PageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $locale = $request->locale();
        $image = $this->image();
        $parent = $this->parent();
        return [
            'id' => $this->id(),
            'type' => $this->type(),
            'published' => $this->published(),
            'title' => $this->title($locale),
            'description' => $this->description($locale),
            'slug' => $this->slug($locale),
            'image' => !is_null($image) ? new MediaResource($image) : null,
            'parent' =>
                !is_null($parent) && $parent instanceof Page
                    ? new PageResource($parent)
                    : null,

            $this->mergeWhen($this->resource instanceof HasBlocks, function () {
                $blocks = $this->blocks();
                return [
                    'blocks' => !is_null($blocks) ? new BlocksCollection($blocks) : [],
                ];
            }),

            $this->mergeWhen($this->resource instanceof HomePage, function () {
                return [];
            }),
        ];
    }
}
