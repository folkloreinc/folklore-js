<?php

namespace App\Resources\Blocks;

use App\Resources\Block;
use App\Contracts\Resources\Blocks\Image as ImageBlockContract;
use Folklore\Contracts\Resources\Image as ImageContract;
use Folklore\Resources\Image;

class ImageBlock extends Block implements ImageBlockContract
{
    public function image(): ?ImageContract
    {
        $image = data_get($this->data, 'image');
        return isset($image) ? new Image($image) : null;
    }

    public function caption(string $locale): ?string
    {
        return data_get($this->data, 'caption.' . $locale);
    }

    public function credits(string $locale): ?string
    {
        return data_get($this->data, 'credits.' . $locale);
    }
}
