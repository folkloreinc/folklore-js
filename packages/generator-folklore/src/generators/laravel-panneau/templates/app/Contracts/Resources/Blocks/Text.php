<?php

namespace App\Contracts\Resources\Blocks;

use App\Contracts\Resources\Block as BaseBlock;

interface Text extends BaseBlock
{
    public function body(string $locale): ?string;
}
