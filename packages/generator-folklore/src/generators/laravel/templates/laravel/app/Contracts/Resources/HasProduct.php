<?php

namespace App\Contracts\Resources;

interface HasProduct
{
    public function product(Edition $edition = null): ?Product;
}
