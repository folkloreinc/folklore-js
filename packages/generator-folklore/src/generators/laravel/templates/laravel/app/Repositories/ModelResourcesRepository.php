<?php

namespace App\Repositories;

use Illuminate\Support\Str;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;
use App\Contracts\Repositories\Resources as ResourcesRepositoryContract;
use App\Contracts\Resources\Resourcable;
use App\Contracts\Resources\Resource;
use Laravel\Scout\Builder as ScoutBuilder;

abstract class ModelResourcesRepository implements ResourcesRepositoryContract
{
    protected $globalQuery = [];

    abstract protected function newModel();

    public function findById(string $id): ?Resource
    {
        $model = $this->findModelById($id);
        return $model instanceof Resourcable ? $model->toResource() : $model;
    }

    public function get(array $params = [], ?int $page = null, ?int $count = null)
    {
        $query = $this->buildQueryFromParams($this->newQuery(), $this->getQueryParams($params));

        if (!is_null($page)) {
            $models =
                $query instanceof ScoutBuilder
                    ? $query->paginate($count, 'page', $page)
                    : $query->paginate($count, ['*'], 'page', $page);
        } else {
            if (!is_null($count)) {
                $query->take($count);
            }
            $models = $query->get();
        }

        // dd($query->toSql());

        $collection = $models->map(function ($model) {
            return $model instanceof Resourcable ? $model->toResource() : $model;
        });
        if (is_null($page)) {
            return $collection;
        }
        $models->setCollection($collection);
        return $models;
    }

    public function count(array $params = []): int
    {
        $query = $this->buildQueryFromParams($this->newQuery(), $this->getQueryParams($params));
        return $query->count();
    }

    public function has(array $params = []): bool
    {
        $query = $this->buildQueryFromParams($this->newQuery(), $this->getQueryParams($params));
        return $query->exists();
    }

    public function getWithLimit(array $params = [], int $limit = 12)
    {
        $query = $this->buildQueryFromParams(
            $this->newQuery(),
            $this->getQueryParams($params)
        )->limit($limit);

        return $this->getFromQuery($query);
    }

    protected function getFromQuery($query, ?int $page = null, ?int $count = null)
    {
        if (!is_null($page)) {
            $models =
                $query instanceof ScoutBuilder
                    ? $query->paginate($count, 'page', $page)
                    : $query->paginate($count, ['*'], 'page', $page);
        } else {
            if (!is_null($count)) {
                $query->take($count);
            }
            $models = $query->get();
        }

        $collection = $models->map(function ($model) {
            return $model instanceof Resourcable ? $model->toResource() : $model;
        });
        if (is_null($page)) {
            return $collection;
        }
        $models->setCollection($collection);
        return $models;
    }

    public function create(array $data): Resource
    {
        $model = $this->newModel();
        $this->saveData($model, $data);
        $this->clearCache();
        return $model instanceof Resourcable ? $model->toResource() : $model;
    }

    public function update(string $id, array $data): ?Resource
    {
        $model = $this->findModelById($id);
        if (is_null($model)) {
            return null;
        }
        $this->saveData($model, $data);
        $this->clearCache();
        return $model instanceof Resourcable ? $model->toResource() : $model;
    }

    public function destroy(string $id): bool
    {
        $model = $this->findModelById($id);
        if (is_null($model)) {
            return false;
        }
        $model->delete();
        return true;
    }

    protected function newQuery($params = null)
    {
        $query = $this->newModel()->newQuery();
        return is_array($params) ? $this->buildQueryFromParams($query, $params) : $query;
    }

    protected function findModelById($id, $params = null)
    {
        return $this->newQuery($params)
            ->where('id', $id)
            ->first();
    }

    protected function saveData($model, array $data)
    {
        $this->fillModel($model, $data);
        $model->save();
        $this->syncRelations($model, $data);
    }

    protected function fillModel($model, array $data)
    {
        $model->fill($data);
    }

    protected function syncRelations($model, array $data)
    {
    }

    protected function getDefaultParams(): array
    {
        return [];
    }

    protected function getQueryParams(array $params): array
    {
        return array_merge($this->getDefaultParams(), $this->globalQuery, $params);
    }

    public function setGlobalQuery(array $query)
    {
        $this->globalQuery = $query;
        return $this;
    }

    protected function buildQueryFromParams($query, $params)
    {
        if (isset($params['order'])) {
            if (is_array($params['order'])) {
                $query->orderBy($params['order'][0], $params['order'][1]);
            } else {
                $query->orderBy($params['order'], 'ASC');
            }
        }

        return $query;
    }

    protected function getSnakeCase(array $items)
    {
        return collect($items)->reduce(function ($newItems, $item, $key) {
            $newItems[Str::snake($key)] = $item;
            return $newItems;
        }, []);
    }

    protected function getParamIds($param): array
    {
        return collect(is_array($param) || $param instanceof Collection ? $param : [$param])
            ->map(function ($value) {
                if ($value instanceof Model) {
                    return $value->id;
                }
                if ($value instanceof Resource) {
                    return $value->id();
                }
                return $value;
            })
            ->toArray();
    }

    protected function clearCache()
    {
        return null;
    }
}
