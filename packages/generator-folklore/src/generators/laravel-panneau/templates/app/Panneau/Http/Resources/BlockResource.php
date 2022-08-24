<?php

namespace App\Panneau\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Contracts\Resources\HasBlocks;
use Folklore\Http\Resources\LocalizedResource;

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

            $this->mergeWhen($type === 'text', function () {
                return [
                    'body' => new LocalizedResource(function ($locale) {
                        return $this->body($locale);
                    }),
                ];
            }),

            'blocks' => $this->when($this->resource instanceof HasBlocks, function () {
                $blocks = $this->blocks();
                return !is_null($blocks) ? new BlocksCollection($blocks) : [];
            }),
        ];
    }
}
