<?php

namespace App\Entities\Blocks;

use App\Entities\Block;
use App\Contracts\Entities\Blocks\Text as TextBlockContract;

class TextBlock extends Block implements TextBlockContract
{
    public function title(string $locale): ?string
    {
        return data_get($this->data, 'title.' . $locale);
    }

    public function body(string $locale): ?string
    {
        return data_get($this->data, 'body.' . $locale);
    }
}
