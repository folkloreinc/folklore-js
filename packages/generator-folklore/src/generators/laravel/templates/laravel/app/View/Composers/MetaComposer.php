<?php

namespace App\View\Composers;

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
        $view->siteName = trans('meta.siteName');
        $view->appId = config('services.facebook.client_id');

        // $page = $view->page instanceof JsonResource ? $view->page->resource : $view->page;

        // if ($page) {
        //     $metadata = $page->metadata();
        //     $title = $metadata->title($locale);
        //     $description = $metadata->description($locale);
        //     $image = $metadata->image();
        //     if (!empty($title) && method_exists($page, 'handle') && $page->handle() !== 'home') {
        //         $view->title = trans('meta.title_prefix', ['title' => $title]);
        //     }
        //     if (!empty($description)) {
        //         $view->description = $description;
        //     }
        //     if (isset($image)) {
        //         $view->image = $image->url();
        //     }
        // }
    }
}
