<?php

namespace App\View\Composers;

use Illuminate\View\View;
use Illuminate\Http\Request;
use App\Site\Metadata\ErrorMetadata;

class ErrorsComposer
{
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function compose(View $view)
    {
        $name = $view->getName();
        $statusCode =
            preg_match('/^errors\:\:([0-9]{3})$/', $name, $matches) === 1
                ? (int) $matches[1]
                : null;
        $view->statusCode = $statusCode;
    }
}
