<?php

namespace App\Contracts\Medias;

use Illuminate\Support\Collection;

interface Image extends Media
{
    public function metadata(): ImageMetadata;

    public function sizes(): Collection;
}
