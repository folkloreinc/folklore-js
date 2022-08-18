<?php

namespace App\Composers;

use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\Resources\Json\JsonResource;

class MetaComposer
{
    /**
     * The request
     *
     * @var \Illuminate\Http\Request
     */
    protected $request;

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
        $locale = $this->request->locale();
        $view->title = trans('meta.title');
        $view->description = trans('meta.description');
        $view->image = asset(trans('meta.image'));
        $view->url = $this->request->url();
        $view->canonical = $this->request->url();
        $view->siteName = trans('meta.siteName');
        $view->appId = config('services.facebook.client_id');

        $page = $view->page instanceof JsonResource ? $view->page->resource : $view->page;
    }
}
