<?php

namespace App\Repositories;

use Folklore\Repositories\Pages as BasePages;
use App\Contracts\Repositories\Pages as PagesContract;
use Folklore\Models\Page as PageBaseModel;
use App\Models\Page as PageModel;
use App\Contracts\Resources\Page as PageContract;

class Pages extends BasePages implements PagesContract
{
    protected function newModel(): PageBaseModel
    {
        return new PageModel();
    }

    public function findById(string $id): ?PageContract
    {
        return parent::findById($id);
    }

    public function findByHandle(string $handle): ?PageContract
    {
        return parent::findByHandle($handle);
    }

    public function findBySlug(string $slug, string $locale = null): ?PageContract
    {
        return parent::findBySlug($slug, $locale);
    }

    public function create($data): PageContract
    {
        return parent::create($data);
    }

    public function update(string $id, $data): ?PageContract
    {
        return parent::update($id, $data);
    }
}
