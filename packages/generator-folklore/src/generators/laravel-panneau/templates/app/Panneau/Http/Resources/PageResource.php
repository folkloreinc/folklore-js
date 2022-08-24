<?php

namespace App\Panneau\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Medias\ImageResource;
use App\Contracts\Resources\Page;
use App\Contracts\Resources\HasBlocks;
use Folklore\Http\Resources\LocalizedResource;

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
            'title' => new LocalizedResource(function ($locale, $fallback) {
                return $this->title($locale, $fallback);
            }),
            'description' => new LocalizedResource(function ($locale, $fallback) {
                return $this->description($locale, $fallback);
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
        ];
    }
}
