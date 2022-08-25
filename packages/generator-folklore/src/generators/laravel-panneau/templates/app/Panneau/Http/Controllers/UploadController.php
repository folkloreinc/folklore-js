<?php

namespace App\Panneau\Http\Controllers;

use App\Panneau\Http\Requests\UploadRequest;
use Folklore\Contracts\Repositories\Medias as MediasRepository;
use Folklore\Http\Resources\Medias\MediaResource;

class UploadController extends Controller
{
    public function __construct(MediasRepository $medias)
    {
        $this->medias = $medias;
    }

    /**
     * Show the account
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function upload(UploadRequest $request)
    {
        $file = $request->file('file');
        $media = $this->medias->createFromFile($file);
        return new MediaResource($media);
    }
}
