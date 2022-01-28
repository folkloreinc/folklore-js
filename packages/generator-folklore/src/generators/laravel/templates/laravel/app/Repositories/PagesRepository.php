<?php

namespace App\Repositories;

use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use App\Contracts\Repositories\Pages as PagesRepositoryContract;
use App\Contracts\Repositories\Blocks as BlocksRepositoryContract;
use App\Contracts\Services\Page as PageService;
use App\Contracts\Resources\Resourcable;
use App\Contracts\Resources\Edition;
use App\Models\Page as PageModel;
use App\Contracts\Resources\Edition as EditionContract;
use App\Contracts\Resources\Page as PageContract;
use App\Repositories\Concerns\GetSlugs;
use App\Repositories\Concerns\UsesDataColumn;
use App\Repositories\Concerns\SyncRelations;
use App\Events\PageSaved;

class PagesRepository extends ModelResourcesRepository implements PagesRepositoryContract
{
    use GetSlugs, UsesDataColumn, SyncRelations;

    public const MEDIAS_PATH = ['image', 'slides.*.image.*'];
    public const BLOCKS_PATH = ['blocks.*'];
    public const ARTICLES_PATH = ['slides.*.article'];
    public const EVENTS_PATH = ['slides.*.event'];
    public const FILMS_PATH = ['slides.*.film'];

    protected $medias;

    protected $blocks;

    protected $edition;

    protected $parent;

    protected $type;

    public function __construct(BlocksRepositoryContract $blocks)
    {
        $this->blocks = $blocks;
    }

    public function setEdition(EditionContract $edition)
    {
        $this->edition = $edition;
        return $this;
    }

    public function setParent(PageContract $parent)
    {
        $this->parent = $parent;
        return $this;
    }

    public function setType($type)
    {
        $this->type = $type;
        return $this;
    }

    protected function newModel()
    {
        return new PageModel();
    }

    protected function newQuery($params = null)
    {
        return parent::newQuery($params)->with(
            'medias',
            'medias.files',
            'medias.metadatas',
            'parent',
            'parent.children'
        );
    }

    public function findById(string $id): ?PageContract
    {
        $model = $this->findModelById($id, [
            'with_blocks' => true,
        ]);
        return $model instanceof Resourcable ? $model->toResource() : null;
    }

    public function findBySlug(string $slug, string $locale = null): ?PageContract
    {
        if (is_null($locale)) {
            $locale = app()->getLocale();
        }

        $model = $this->newQuery([
            'with_blocks' => true,
        ])
            ->where('slug_' . $locale, $slug)
            ->first();
        return $model instanceof Resourcable ? $model->toResource() : null;
    }

    public function findByParentAndSlug(
        PageContract $parent,
        string $slug,
        string $locale = null
    ): ?PageContract {
        if (is_null($locale)) {
            $locale = app()->getLocale();
        }

        $model = $this->newQuery([
            'with_blocks' => true,
        ])
            ->where('slug_' . $locale, $slug)
            ->where('parent_id', $parent->id())
            ->first();
        return $model instanceof Resourcable ? $model->toResource() : null;
    }

    public function findByIndexHandle(string $handle): ?PageContract
    {
        $model = $this->newQuery()
            ->where('type', 'index')
            ->where('handle', $handle)
            ->first();
        return $model instanceof Resourcable ? $model->toResource() : null;
    }

    public function findByHandle(string $handle): ?PageContract
    {
        $model = $this->newQuery()
            ->where('handle', $handle)
            ->first();
        return $model instanceof Resourcable ? $model->toResource() : null;
    }

    public function findByEditionAndHandle(Edition $edition, string $handle): ?PageContract
    {
        $model = $this->newQuery()
            ->where('edition_id', $edition->id())
            ->where('handle', $handle)
            ->first();
        return $model instanceof Resourcable ? $model->toResource() : null;
    }

    public function findEdition(Edition $edition): ?PageContract
    {
        $model = $this->newQuery()
            ->where('type', 'edition')
            ->where('edition_id', $edition->id())
            ->first();
        return $model instanceof Resourcable ? $model->toResource() : null;
    }

    public function getSections(): Collection
    {
        return parent::get(['type' => 'section', 'parent_id' => null]);
    }

    public function getIndexes(): Collection
    {
        return parent::get(['type' => 'index', 'parent_id' => null]);
    }

    public function getPageSlugs()
    {
        return $this->getSlugs(['type' => 'page']);
    }

    public function getSectionSlugs()
    {
        return $this->getSlugs(['type' => ['section', 'edition']]);
    }

    public function getIndexSlugs()
    {
        return $this->getSlugs(['type' => 'index']);
    }

    public function getScopeSlugs()
    {
        return $this->getSlugs(['type' => 'scope']);
    }

    public function create(array $data): PageContract
    {
        return parent::create($data);
    }

    public function update(string $id, array $data): ?PageContract
    {
        return parent::update($id, $data);
    }

    protected function saveData($model, array $data)
    {
        // dd($data, $model->parent());
        $modelData = Arr::only($data, $model->getFillable());
        $model->fill($modelData);

        $data = $this->reducePaths(self::BLOCKS_PATH, $data, function ($newData, $path, $item) {
            $newItem = isset($item['id'])
                ? $this->blocks->update($item['id'], $item)
                : $this->blocks->create($item);
            data_set($newData, $path, $newItem);
            return $newData;
        });

        $newData = Arr::only($data, $model->getDataFields());
        $newData = $this->replaceRelationsByPath(self::MEDIAS_PATH, $newData, 'media');
        $newData = $this->replaceRelationsByPath(self::BLOCKS_PATH, $newData, 'block');
        $newData = $this->replaceRelationsByPath(self::ARTICLES_PATH, $newData, 'article');
        $newData = $this->replaceRelationsByPath(self::EVENTS_PATH, $newData, 'event');
        $newData = $this->replaceRelationsByPath(self::FILMS_PATH, $newData, 'film');
        $model->data = $newData;

        if (!isset($data['parent_id'])) {
            $parentId = data_get($data, 'parent.id');
            if (!is_null($parentId)) {
                $model->parent()->associate($parentId);
            } else {
                $model->parent()->dissociate();
            }
        }

        $editionId = data_get($data, 'edition.id');
        $editionId = is_null($editionId) ? data_get($data, 'edition_id') : $editionId;

        if (!is_null($editionId)) {
            $model->edition()->associate($editionId);
        } else {
            $model->edition()->dissociate();
        }

        $model->save();

        $this->syncRelations($model, $data);
    }

    protected function syncRelations($model, array $data)
    {
        $mediaIds = $this->getRelationIds(self::MEDIAS_PATH, $data);
        $model->medias()->sync($mediaIds);

        $blockIds = $this->getRelationIds(self::BLOCKS_PATH, $data);
        $model->blocks()->sync($blockIds);

        $articleIds = $this->getRelationIds(self::ARTICLES_PATH, $data);
        $model->articles()->sync($articleIds);

        $eventIds = $this->getRelationIds(self::EVENTS_PATH, $data);
        $model->events()->sync($eventIds);

        $filmIds = $this->getRelationIds(self::FILMS_PATH, $data);
        $model->films()->sync($filmIds);

        if ($model->type === 'index') {
            $scopes = collect(data_get($data, 'scopes', []));
            $this->syncScopes($model, $scopes);
        }

        $model->refresh();
    }

    protected function syncScopes($model, Collection $scopes)
    {
        $ids = [];
        foreach ($scopes as $scope) {
            if (isset($scope['id'])) {
                $scope = $this->update($scope['id'], Arr::except($scope, ['id']));
            } else {
                $scope['type'] = 'scope';
                $scope['parent_id'] = $model->id;
                $scope = $this->create($scope);
            }
            $ids[] = $scope->id();
        }

        $model
            ->children()
            ->whereNotIn('id', $ids)
            ->delete();
    }

    protected function getMediasPath(): array
    {
        return PagesRepository::MEDIAS_PATH;
    }

    protected function getDefaultParams(): array
    {
        $params = ['order' => 'order'];

        if (isset($this->edition)) {
            $params['edition'] = $this->edition->id();
        }
        if (isset($this->parent)) {
            $params['parent_id'] = $this->parent->id();
        }
        if (isset($this->type)) {
            $params['type'] = $this->type;
        }
        return $params;
    }

    protected function buildQueryFromParams($query, $params)
    {
        $query = parent::buildQueryFromParams($query, $params);

        if (isset($params['search']) && !empty($params['search'])) {
            if (is_numeric($params['search'])) {
                $query->where('id', $params['search']);
            } else {
                return $this->buildSearchQueryFromParams($params['search'], $query, $params);
            }
        }

        // @TODO dont show with unpublished parent pages
        if (isset($params['published']) && $params['published'] === true) {
            $query->where('published', true);
        } elseif (isset($params['published']) && $params['published'] === false) {
            $query->where('published', false);
        }

        if (isset($params['with_blocks']) && $params['with_blocks'] === true) {
            $query->with(
                'blocks',
                'blocks.medias',
                'blocks.medias.files',
                'blocks.medias.metadatas'
            );
        }

        if (array_key_exists('parent_id', $params) || array_key_exists('parent', $params)) {
            $parent = data_get($params, 'parent_id', data_get($params, 'parent'));
            $id = $parent instanceof PageContract ? $parent->id() : $parent;
            $query->where('parent_id', $id);
        }

        if (isset($params['edition']) && !empty($params['edition'])) {
            $ids = $this->getParamIds($params['edition']);
            $query->whereIn('edition_id', $ids);
        }

        if (isset($params['handle']) && !empty($params['handle'])) {
            $query->where('handle', $params['handle']);
        }

        if (isset($params['type']) && !empty($params['type'])) {
            $query->whereIn('type', (array) $params['type']);
        }

        if (isset($params['exclude_type']) && !empty($params['exclude_type'])) {
            $query->whereNotIn('type', (array) $params['exclude_type']);
        }

        return $query;
    }

    protected function buildSearchQueryFromParams($term, $query, $params)
    {
        $query = PageModel::search($term);

        if (isset($params['published']) && $params['published'] === true) {
            $query->where('published', 1);
        }

        return $query;
    }

    protected function clearCache()
    {
        event(new PageSaved());
    }
}
