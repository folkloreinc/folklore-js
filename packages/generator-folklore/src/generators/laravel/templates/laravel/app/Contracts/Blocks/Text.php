<?php

namespace App\Contracts\Blocks;

interface Text extends Block
{
    public function body(string $locale): ?string;
}
