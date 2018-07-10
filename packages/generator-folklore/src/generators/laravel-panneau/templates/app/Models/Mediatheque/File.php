<?php

namespace App\Models\Mediatheque;

use Folklore\Mediatheque\Models\File as BaseFile;

class File extends BaseFile
{
    protected $hidden = [
        'pivot',
        'path'
    ];
}
