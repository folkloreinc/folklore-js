<?php

namespace App\Contracts\Medias;

interface ImageMetadata extends MediaMetadata
{
    public function width(): int;

    public function height(): int;

    public function colors(): ?array;
}
