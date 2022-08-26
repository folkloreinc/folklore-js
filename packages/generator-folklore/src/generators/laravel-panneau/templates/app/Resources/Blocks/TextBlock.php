<?php

namespace App\Resources\Blocks;

use Folklore\Resources\Block;
use App\Contracts\Resources\Blocks\Text as TextBlockContract;

class TextBlock extends Block implements TextBlockContract
{
    public function body(string $locale): ?string
    {
        return data_get($this->data, 'body.' . $locale);
    }
}
