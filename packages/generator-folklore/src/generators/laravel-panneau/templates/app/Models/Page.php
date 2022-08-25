<?php

namespace App\Models;

use Folklore\Models\Page as BasePage;

class Page extends BasePage
{
    protected $typeResources = [
        'text' => \App\Resources\Pages\HomePage::class,
    ];
}
