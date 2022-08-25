<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Contracts\Resources\HasBlocks;
use Folklore\Http\Resources\LocalizedResource;
use App\Contracts\Resources\Blocks\Text as TextBlock;

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
        $locale = $request->locale();
        return [
            'id' => $this->id(),
            'type' => $type,
            'blocks' => $this->when($this->resource instanceof HasBlocks, function () {
                $blocks = $this->blocks();
                return !is_null($blocks) ? new BlocksCollection($blocks) : [];
            }),

            $this->mergeWhen($this->resource instanceof TextBlock, function () use ($locale) {
                return [
                    'body' => $this->body($locale),
                ];
            }),
        ];
    }
}
