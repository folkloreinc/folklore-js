<?php

namespace App\Composers;

use Illuminate\View\View;
use Illuminate\Http\Request;
use Illuminate\Contracts\View\Factory;
use StdClass;

class RootComposer
{
    protected $request = null;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function compose(View $view)
    {
        $path = '/'.ltrim($this->request->path(), '/');
        $locale = isset($view->locale) ? $view->locale : app()->getLocale();
        $viewProps = is_array($view->props) ? $view->props : [];
        $view->props = array_merge($viewProps, [
            'url' => $path,
            'locale' => $locale,
            'routes' => $view->routes,
            'messages' => $view->translations,
        ]);
    }
}
