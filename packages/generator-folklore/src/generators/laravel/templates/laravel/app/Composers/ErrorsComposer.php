<?php

namespace App\Composers;

use Illuminate\View\View;
use Illuminate\Http\Request;

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
        $view->statusCode = preg_match('/^errors\:\:([0-9]{3})$/', $name, $matches) === 1 ? (int)$matches[1] : null;
    }
}
