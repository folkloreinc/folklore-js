<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Folklore\Contracts\Resources\HasBlocks;
use Folklore\Http\Resources\LocalizedResource;
use App\Contracts\Resources\Blocks\Text as TextBlock;
use App\Contracts\Resources\Blocks\ImageBlock as ImageBlock;
use Folklore\Http\Resources\MediaResource;

class BlockResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $type = $this->type();
        return [
            'id' => $this->id(),
            'type' => $type,
            'blocks' => $this->when($this->resource instanceof HasBlocks, function () {
                $blocks = $this->blocks();
                return !is_null($blocks) ? new BlocksCollection($blocks) : [];
            }),

            $this->mergeWhen($this->resource instanceof TextBlock, function () {
                return [
                    'title' => new LocalizedResource(function ($locale) {
                        return $this->title($locale);
                    }),
                    'body' => new LocalizedResource(function ($locale) {
                        return $this->body($locale);
                    }),
                ];
            }),

            $this->mergeWhen($this->resource instanceof ImageBlock, function () {
                $image = $this->image();
                return [
                    'image' => !empty($image) ? new MediaResource($image) : null,
                    'caption' => new LocalizedResource(function ($locale) {
                        return $this->caption($locale);
                    }),
                    'credits' => new LocalizedResource(function ($locale) {
                        return $this->credits($locale);
                    }),
                ];
            }),
        ];
    }
}
