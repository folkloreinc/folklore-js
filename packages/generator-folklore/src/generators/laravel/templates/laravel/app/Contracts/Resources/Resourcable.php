<?php

namespace App\Contracts\Resources;

interface Resourcable
{
    public function toResource(): Resource;
}
