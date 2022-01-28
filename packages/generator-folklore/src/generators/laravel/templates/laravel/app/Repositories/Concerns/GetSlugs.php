<?php

namespace App\Repositories\Concerns;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

trait GetSlugs
{
    public function getSlugs($params = [], $columns = null): Collection
    {
        $columns = is_null($columns)
            ? collect(config('locale.locales'))->map(function ($locale) {
                return 'slug_' . $locale;
            })
            : collect($columns);

        $query = $this->buildSlugQuery(
            DB::table($this->newModel()->getTable())->select($columns->toArray()),
            $params
        );

        $items = $query->get();
        return $items
            ->reduce(function ($slugs, $item) use ($columns) {
                $itemSlugs = $columns->map(function ($column) use ($item) {
                    return $item->{$column};
                });
                return $slugs->merge($itemSlugs);
            }, collect([]))
            ->filter(function ($slug) {
                return !empty($slug);
            })
            ->unique()
            ->values();
    }

    protected function buildSlugQuery($query, $params)
    {
        if (isset($params['type']) && !empty($params['type'])) {
            $query->whereIn('type', (array)$params['type']);
        }

        return $query;
    }
}
