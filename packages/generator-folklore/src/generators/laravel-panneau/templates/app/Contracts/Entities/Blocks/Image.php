<?php

namespace App\Contracts\Entities\Blocks;

use App\Contracts\Entities\Block as BaseBlock;
use Folklore\Contracts\Entities\Image as ImageContract;

interface Image extends BaseBlock
{
    public function image(): ?ImageContract;

    public function caption(string $locale): ?string;

    public function credits(string $locale): ?string;
}
