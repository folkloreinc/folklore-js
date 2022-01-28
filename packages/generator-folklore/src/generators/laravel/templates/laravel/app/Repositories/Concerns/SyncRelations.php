<?php

namespace App\Repositories\Concerns;

use Illuminate\Support\Collection;
use Illuminate\Support\Arr;

trait SyncRelations
{
    protected function syncRelation($items, $relation)
    {
        $ids = collect($items)
            ->filter(function ($item) {
                return !is_null($item);
            })
            ->map(function ($item) {
                return data_get($item, 'id');
            })
            ->filter(function ($id) {
                return !is_null($id);
            })
            ->unique()
            ->values();

        $relation->sync($ids);
    }

    protected function syncRelationWithOrder($items, $relation)
    {
        $ids = collect($items)
            ->filter(function ($item) {
                return !is_null($item);
            })
            ->map(function ($item) {
                return data_get($item, 'id');
            })
            ->filter(function ($id) {
                return !is_null($id);
            })
            ->unique()
            ->values();

        $idsWithOrder = [];
        foreach ($ids as $index => $id) {
            $idsWithOrder[$id] = [
                'order' => $index,
            ];
        }

        $relation->sync($idsWithOrder);
    }
}
