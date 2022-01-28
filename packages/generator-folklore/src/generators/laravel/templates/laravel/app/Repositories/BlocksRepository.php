<?php

namespace App\Repositories;

use Illuminate\Support\Arr;
use App\Contracts\Repositories\Blocks as BlocksRepositoryContract;
use App\Contracts\Resources\Resourcable;
use App\Models\Block as BlockModel;
use App\Contracts\Blocks\Block as BlockContract;
use App\Repositories\Concerns\UsesDataColumn;

class BlocksRepository extends ModelResourcesRepository implements BlocksRepositoryContract
{
    use UsesDataColumn;

    public const MEDIAS_PATH = [
        'image.*',
        'document.*',
        'members.*.image',
        'partners.*.image.*',
        'images.*',
    ];

    public const BLOCKS_PATH = ['blocks.*'];

    public const FILMS_PATH = ['film'];

    public const EVENTS_PATH = ['event'];

    public const EDITIONS_PATH = ['edition'];

    protected function newModel()
    {
        return new BlockModel();
    }

    protected function newQuery($params = null)
    {
        return parent::newQuery($params)->with('medias', 'medias.files', 'medias.metadatas');
    }

    public function findById(string $id): ?BlockContract
    {
        $model = $this->findModelById($id);
        return $model instanceof Resourcable ? $model->toResource() : null;
    }

    public function findByHandle(string $handle): ?BlockContract
    {
        $model = $this->newQuery()
            ->where('handle', $handle)
            ->first();
        return $model instanceof Resourcable ? $model->toResource() : null;
    }

    public function create(array $data): BlockContract
    {
        return parent::create($data);
    }

    public function update(string $id, array $data): ?BlockContract
    {
        return parent::update($id, $data);
    }

    protected function saveData($model, array $data)
    {
        $modelData = Arr::only($data, $model->getFillable());
        $model->fill($modelData);

        $data = $this->reducePaths(self::BLOCKS_PATH, $data, function ($newData, $path, $item) {
            $newItem = isset($item['id'])
                ? $this->update($item['id'], $item)
                : $this->create($item);
            data_set($newData, $path, $newItem);
            return $newData;
        });

        $newData = Arr::except($data, $model->getFillable());
        $newData = $this->replaceRelationsByPath(self::MEDIAS_PATH, $newData, 'media');
        $newData = $this->replaceRelationsByPath(self::BLOCKS_PATH, $newData, 'block');
        $newData = $this->replaceRelationsByPath(self::FILMS_PATH, $newData, 'film');
        $newData = $this->replaceRelationsByPath(self::EVENTS_PATH, $newData, 'event');
        $newData = $this->replaceRelationsByPath(self::EDITIONS_PATH, $newData, 'edition');
        $model->data = $newData;

        $model->save();
        $this->syncRelations($model, $data);
    }

    protected function syncRelations($model, array $data)
    {
        $mediaIds = $this->getRelationIds(self::MEDIAS_PATH, $data);
        $model->medias()->sync($mediaIds);

        $blockIds = $this->getRelationIds(self::BLOCKS_PATH, $data);
        $model->blocks()->sync($blockIds);

        $filmIds = $this->getRelationIds(self::FILMS_PATH, $data);
        $model->films()->sync($filmIds);

        $eventIds = $this->getRelationIds(self::EVENTS_PATH, $data);
        $model->events()->sync($eventIds);

        $editionIds = $this->getRelationIds(self::EDITIONS_PATH, $data);
        $model->editions()->sync($editionIds);

        $model->refresh();
    }

    protected function buildQueryFromParams($query, $params)
    {
        // $query = parent::buildQueryFromParams($query, $params);

        if (isset($params['type']) && !empty($params['type'])) {
            $query->whereIn(
                'type',
                is_array($params['type']) ? $params['type'] : [$params['type']]
            );
        }

        if (isset($params['exclude_type']) && !empty($params['exclude_type'])) {
            $query->whereNotIn(
                'type',
                is_array($params['exclude_type'])
                    ? $params['exclude_type']
                    : [$params['exclude_type']]
            );
        }

        if (isset($params['order']) && is_array($params['order'])) {
            $query->orderBy($params['order'][0], $params['order'][1]);
        } elseif (isset($params['order'])) {
            $query->orderBy($params['order'], 'ASC');
        }

        return $query;
    }
}
