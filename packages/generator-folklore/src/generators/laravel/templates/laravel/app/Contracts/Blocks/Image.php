<?php

namespace App\Contracts\Blocks;

use App\Contracts\Medias\Image as ImageResource;

interface Image extends Block
{
    public function image(string $locale): ?ImageResource;

    public function alt(string $locale): ?string;

    public function credits(string $locale): ?string;

    public function link(string $locale): ?string;
}
