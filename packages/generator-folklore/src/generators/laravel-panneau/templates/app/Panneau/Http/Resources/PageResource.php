<?php

namespace App\Panneau\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Medias\ImageResource;
use App\Contracts\Resources\Page;
use App\Contracts\Resources\HasBlocks;
use Folklore\Http\Resources\LocalizedResource;
use App\Contracts\Resources\Pages\Home as HomePage;

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
        $isPanneauIndex = $request->isPanneauIndex();

        return [
            'id' => $this->id(),
            'type' => $this->type(),
            'published' => $this->published(),
            'title' => new LocalizedResource(function ($locale) {
                return $this->title($locale);
            }),
            'description' => new LocalizedResource(function ($locale) {
                return $this->description($locale);
            }),
            'slug' => new LocalizedResource(function ($locale) {
                return $this->slug($locale);
            }),
            'image' => !is_null($image) ? new ImageResource($image) : null,
            'parent' =>
                !is_null($parent) && $parent instanceof Page
                    ? new ParentPageResource($parent)
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