<?php

namespace App\Contracts\Medias;

interface Video extends Media
{
    public function metadata(): VideoMetadata;
}
