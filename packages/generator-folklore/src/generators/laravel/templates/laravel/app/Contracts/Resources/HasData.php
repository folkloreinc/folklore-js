<?php

namespace App\Contracts\Resources;

interface HasData
{
    public function getDataFields(): array;
}
