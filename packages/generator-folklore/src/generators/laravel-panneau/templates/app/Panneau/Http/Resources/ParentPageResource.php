<?php

namespace App\Panneau\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Folklore\Http\Resources\MediaResource;
use App\Contracts\Resources\Page;
use Folklore\Http\Resources\LocalizedResource;

class ParentPageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $image = $this->image();
        $parent = $this->parent();

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
            'image' => !is_null($image) ? new MediaResource($image) : null,
            'parent' =>
                !is_null($parent) && $parent instanceof Page
                    ? new ParentPageResource($parent)
                    : null,
        ];
    }
}
