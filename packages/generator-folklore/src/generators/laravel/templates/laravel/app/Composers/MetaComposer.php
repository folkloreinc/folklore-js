<?php

namespace App\Composers;

use Illuminate\View\View;
use Illuminate\Http\Request;

class MetaComposer
{
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function compose(View $view)
    {
        $view->meta = array_merge([
            'title' => trans('meta.title'),
            'description' => trans('meta.description'),
            'thumbnail' => asset('img/facebook.jpg'),
        ], !is_null($view->meta) ? $view->meta : []);
    }
}
