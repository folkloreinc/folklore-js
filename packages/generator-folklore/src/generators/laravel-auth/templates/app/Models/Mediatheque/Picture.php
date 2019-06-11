<?php

namespace App\Models\Mediatheque;

use Folklore\Mediatheque\Models\Picture as BasePicture;

class Picture extends BasePicture
{
    protected $hidden = [
        'files',
        'pivot',
    ];
}
