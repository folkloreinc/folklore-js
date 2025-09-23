<?php

namespace App\Contracts\Entities\Blocks;

use App\Contracts\Entities\Block as BaseBlock;

interface Text extends BaseBlock
{
    public function title(string $locale): ?string;

    public function body(string $locale): ?string;
}
