<?php

namespace App\Repositories\Concerns;

use Illuminate\Support\Collection;
use Illuminate\Support\Arr;
use GuzzleHttp\Client as HttpClient;
use App\Contracts\Repositories\Medias as MediasRepository;

trait SyncMedias
{
    protected function getMediaFromPath(string $path)
    {
        $repository = resolve(MediasRepository::class);
        $media = $repository->findByPath($path);
        if (is_null($media)) {
            $media = $repository->createFromPath($path);
        }
        return $media;
    }
}
