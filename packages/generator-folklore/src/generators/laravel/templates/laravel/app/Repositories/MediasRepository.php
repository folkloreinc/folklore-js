<?php

namespace App\Repositories;

use Symfony\Component\HttpFoundation\File\File;
use App\Models\Media as MediaModel;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use App\Contracts\Repositories\Medias as MediasRepositoryContract;
use App\Contracts\Medias\Media as MediaContract;
use Folklore\Mediatheque\Contracts\Type\Factory as TypeFactory;
use App\Contracts\Resources\Resourcable;
use GuzzleHttp\Client as HttpClient;
use Exception;

class MediasRepository extends ModelResourcesRepository implements MediasRepositoryContract
{
    protected $typeFactory;

    public function __construct(TypeFactory $typeFactory)
    {
        $this->typeFactory = $typeFactory;
    }

    protected function newModel(): MediaModel
    {
        return new MediaModel();
    }

    protected function newQuery($params = null)
    {
        return parent::newQuery($params)->with('files', 'metadatas');
    }

    public function findById(string $id): ?MediaContract
    {
        return parent::findById($id);
    }

    public function findByName(string $name): ?MediaContract
    {
        $model = $this->newQuery()
            ->where('name', $name)
            ->first();
        return $model instanceof Resourcable ? $model->toResource() : $model;
    }

    public function findByPath(string $path): ?MediaContract
    {
        $name = $this->getNameFromPath($path);
        return $this->findByName($name);
    }

    public function create($data): MediaContract
    {
        return parent::create($data);
    }

    public function createFromFile(File $file, array $data = []): ?MediaContract
    {
        $type = $this->typeFactory->typeFromPath($file->getRealPath());
        if (is_null($type)) {
            return null;
        }
        $model = $type->newModel();
        $model->setOriginalFile($file);
        $this->fillModel($model, $data);
        $model->save();
        $model->load('files');
        return $model instanceof Resourcable ? $model->toResource() : $model;
    }

    public function createFromPath(string $path, array $data = []): ?MediaContract
    {
        $name = $this->getNameFromPath($path);
        if (filter_var($path, FILTER_VALIDATE_URL)) {
            $path = $this->downloadFile($path);
        }
        return !empty($path)
            ? $this->createFromFile(
                new File($path),
                array_merge(
                    !empty($name)
                        ? [
                            'name' => $name,
                        ]
                        : [],
                    $data
                )
            )
            : null;
    }

    public function update(string $id, $data): ?MediaContract
    {
        return parent::update($id, $data);
    }

    protected function downloadFile(string $url): ?string
    {
        $ext = pathinfo($url, PATHINFO_EXTENSION);
        $tempPath = tempnam(sys_get_temp_dir(), 'media') . '.' . $ext;
        $client = new HttpClient();
        try {
            $client->request('GET', $url, ['sink' => $tempPath, 'verify' => false]);
            return $tempPath;
        } catch (Exception $e) {
            // dd($e);
            Log::error($e);
            return null;
        }
    }

    protected function getNameFromPath(string $path): ?string
    {
        $ext = pathinfo($path, PATHINFO_EXTENSION);
        $name = filter_var($path, FILTER_VALIDATE_URL)
            ? parse_url($path, PHP_URL_PATH)
            : basename($path);
        return Str::slug(
            !empty($ext) ? preg_replace('/\.' . preg_quote($ext, '/') . '$/', '', $name) : $name
        );
    }
}
