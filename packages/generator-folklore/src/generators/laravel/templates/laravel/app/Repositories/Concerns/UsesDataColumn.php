<?php

namespace App\Repositories\Concerns;

use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Panneau\Contracts\ResourceItem;
use App\Contracts\Resources\Resource;
use Illuminate\Database\Eloquent\Model;
use Closure;

trait UsesDataColumn
{
    protected function replaceRelationsByPath(
        $relationPaths,
        array $data,
        $pathPrefix = 'item'
    ): array {
        // prettier-ignore
        return $this->reducePaths($relationPaths, $data, function ($newData, $path, $item) use ($pathPrefix) {
            data_set($newData, $path, $this->getPathFromItem($item, $pathPrefix));
            return $newData;
        });
    }

    protected function reducePaths($relationPaths, array $data, Closure $reducer): array
    {
        $pathPatterns = $this->getRelationPathPatterns($relationPaths);
        $dataPaths = array_keys(self::dot($data));

        // prettier-ignore
        return collect($dataPaths)->reduce(function ($newData, $path) use ($pathPatterns, $reducer) {
            return $pathPatterns->reduce(function ($newData, $pattern) use ($path, $reducer) {
                return preg_match($pattern, $path) === 1 ?
                    $reducer($newData, $path, data_get($newData, $path)) : $newData;
            }, $newData);
        },
        $data);
    }

    protected function getRelationIds($relationPaths, array $data)
    {
        $pathPatterns = $this->getRelationPathPatterns($relationPaths);
        $dataPaths = array_keys(self::dot($data));

        $ids = collect($dataPaths)
            ->filter(function ($path) use ($pathPatterns) {
                return $pathPatterns->contains(function ($pattern) use ($path) {
                    return preg_match($pattern, $path) === 1;
                });
            })
            ->map(function ($path) use ($data) {
                return $this->getIdFromItem(data_get($data, $path));
            })
            ->filter(function ($id) {
                return !is_null($id);
            })
            ->unique()
            ->values()
            ->toArray();

        return $ids;
    }

    protected function getRelationPathPatterns(array $paths): Collection
    {
        return collect($paths)->map(function ($path) {
            $pattern = preg_replace('/[*]{2}/', '__full_wildcard__', $path);
            $pattern = preg_replace('/[*]/', '__wildcard__', $pattern);
            $pattern = preg_quote($pattern, '/');
            $pattern = preg_replace('/__full_wildcard__/', '.*?', $pattern);
            $pattern = preg_replace('/__wildcard__/', '[^\.]+', $pattern);
            return '/^' . $pattern . '$/';
        });
    }

    protected function getPathFromItem($item, $pathPrefix): ?string
    {
        $id = $this->getIdFromItem($item);
        if (!empty($id)) {
            return $pathPrefix . '://' . $id;
        }
        return null;
    }

    protected function getIdFromItem($item)
    {
        if (is_numeric($item) || is_string($item)) {
            return $item;
        } elseif (is_array($item)) {
            return data_get($item, 'id');
        } elseif ($item instanceof Model) {
            return $item->id;
        } elseif ($item instanceof ResourceItem || $item instanceof Resource) {
            return $item->id();
        }
        return null;
    }

    private static function dot($array, $prepend = '')
    {
        $results = [];
        foreach ($array as $key => $value) {
            // prettier-ignore
            if ((is_array($value) && !empty($value)) ||
                ($value instanceof Collection && $value->count() > 0)
            ) {
                $results[$prepend . $key] = null;
                $results = array_merge($results, self::dot($value, $prepend . $key . '.'));
            } else {
                $results[$prepend . $key] = $value;
            }
        }

        return $results;
    }
}
