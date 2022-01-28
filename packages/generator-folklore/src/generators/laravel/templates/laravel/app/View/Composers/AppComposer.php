<?php

namespace App\View\Composers;

use Illuminate\Http\Request;
use Illuminate\View\View;
use App\Http\Resources\UserResource;

class AppComposer
{
    /**
     * The request
     *
     * @var \Illuminate\Http\Request
     */
    protected $request;

    protected $onlineFilms;

    /**
     * Create a new profile composer.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Bind data to the view.
     *
     * @param  View  $view
     * @return void
     */
    public function compose(View $view)
    {
        $user = $this->request->user();
        $pageResource = isset($view->page) ? $view->page : null;

        $view->props = array_merge(isset($view->props) ? $view->props : [], [
            'locale' => app()->getLocale(),
            'locales' => config('locale.locales'),
            'routes' => $view->routes,
            'handles' => $view->handles,
            'indexSlugs' => $view->indexSlugs,
            'translations' => $view->translations,
            'keys' => $view->keys,
            'user' => !is_null($user) ? new UserResource($user) : null,
            'pages' => !is_null($pageResource) ? [$pageResource] : null,
            'menus' => !is_null($view->menus) ? $view->menus : null,
            'statusCode' => $view->statusCode,
        ]);
    }
}
