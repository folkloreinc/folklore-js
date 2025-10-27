<?php

namespace App\Entities\Blocks;

use App\Entities\Block;
use App\Contracts\Entities\Blocks\Image as ImageBlockContract;
use Folklore\Contracts\Entities\Image as ImageContract;
use Folklore\Entities\Image;

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
