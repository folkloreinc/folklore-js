<?php

namespace App\Repositories\Concerns;

use Illuminate\Support\Collection;
use Illuminate\Support\Arr;

trait HandlesTaxonomies
{
    protected function getTaxonomyKeys($paths)
    {
        return collect($paths)->map(function ($path) {
            return explode('.', $path)[0];
        });
    }

    protected function getTaxonomyKey($taxonomyItem)
    {
        $taxonomyId = $taxonomyItem->id();
        return preg_match('/^index\:(.*)$/', $taxonomyId, $matches) === 1
            ? $matches[1]
            : $taxonomyId;
    }

    protected function convertTaxonomiesToArray($paths, $data)
    {
        return $this->getTaxonomyKeys($paths)->reduce(function ($data, $key) {
            $id = Arr::get($data, $key . '.id');
            $item = Arr::get($data, $key);
            if (is_array($item) && is_null($id)) {
                $items = Arr::get($data, $key, []);
                Arr::set($data, $key, array_values($items));
            }
            return $data;
        }, $data);
    }

    protected function fillTaxonomyData($paths, $data, $item)
    {
        return $this->getTaxonomyKeys($paths)->reduce(function ($data, $key) use ($item) {
            $taxonomyItems = $item->{$key}();
            if ($taxonomyItems instanceof Collection) {
                foreach ($taxonomyItems as $taxonomyItem) {
                    $data = $this->fillTaxonomyFields(
                        $data,
                        $key . '.' . $this->getTaxonomyKey($taxonomyItem),
                        $taxonomyItem
                    );
                }
            } elseif (!is_null($taxonomyItems)) {
                $data = $this->fillTaxonomyFields($data, $key, $taxonomyItems);
            }
            return $data;
        }, $data);
    }

    protected function fillLocalizedTaxonomyData($paths, $data, $item, $locale)
    {
        return $this->getTaxonomyKeys($paths)->reduce(function ($data, $key) use ($item, $locale) {
            $taxonomyItems = $item->{$key}();
            if ($taxonomyItems instanceof Collection) {
                foreach ($taxonomyItems as $taxonomyItem) {
                    $data = $this->fillTaxonomyLocalizedFields(
                        $data,
                        $key . '.' . $this->getTaxonomyKey($taxonomyItem),
                        $taxonomyItem,
                        $locale
                    );
                }
            } elseif (!is_null($taxonomyItems)) {
                $data = $this->fillTaxonomyLocalizedFields($data, $key, $taxonomyItems, $locale);
            }
            return $data;
        }, $data);
    }

    protected function fillTaxonomyFields($newData, $key, $taxonomyItem)
    {
        $taxonomyId = $taxonomyItem->id();
        $id =
            preg_match('/^index\:/', $taxonomyId, $matches) === 1
                ? Str::slug($taxonomyItem->label('en'))
                : $taxonomyId;
        Arr::set($newData, $key . '.id', $id);
        Arr::set($newData, $key . '.type', $taxonomyItem->type());
        $data = Arr::except($taxonomyItem->toArray(), ['id', 'type', 'label']);
        foreach ($data as $fieldKey => $fieldValue) {
            // prettier-ignore
            if (preg_match(
                '/^(.*?)\_(' . implode('|', config('locale.locales')) . ')$/',
                $fieldKey
            ) === 0) {
                Arr::set($newData, $key . '.' . $fieldKey, $fieldValue);
            }
        }
        return $newData;
    }

    protected function fillTaxonomyLocalizedFields($newData, $key, $taxonomyItem, $locale)
    {
        Arr::set($newData, $key . '.label.' . $locale, $taxonomyItem->label());
        $data = Arr::except($taxonomyItem->toArray(), ['id', 'type', 'label']);
        foreach ($data as $fieldKey => $fieldValue) {
            // prettier-ignore
            if (preg_match('/^(.*?)\_' . preg_quote($locale, '/') . '$/', $fieldKey, $matches) === 1) {
                Arr::set($newData, $key . '.' . $matches[1] . '.' . $locale, $fieldValue);
            }
        }
        return $newData;
    }
}
