<?php

namespace App\Contracts\Resources\Blocks;

use App\Contracts\Resources\Block as BaseBlock;
use Folklore\Contracts\Resources\Image as ImageContract;

interface Image extends BaseBlock
{
    public function image(): ?ImageContract;

    public function caption(string $locale): ?string;

    public function credits(string $locale): ?string;
}
