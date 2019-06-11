<?php

namespace App\Models\Mediatheque;

use Folklore\Mediatheque\Models\Video as BaseVideo;

class Video extends BaseVideo
{
    protected $hidden = [
        'pivot',
    ];

    protected $appends = [
        'original_file',
        'thumbnails',
        'url',
        'duration_human',
        'type',
        'mp4_url',
        'thumbnail'
    ];

    protected function getMp4UrlAttribute()
    {
        $mp4 = $this->files->mp4;
        return !is_null($mp4) ? $mp4->url : $this->url;
    }

    protected function getThumbnailAttribute()
    {
        $thumbnails = $this->getThumbnails();
        return sizeof($thumbnails) ? image()->url($thumbnails[0]->getUrl(), ['thumbnail']) : null;
    }
}
