<?php

namespace App\Composers;

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

        $storyLink = $view->storyLink;

        // Meta

        $view->title = trans('app.title');
        $view->description = trans('app.description');
        $view->image = asset(trans('app.facebook_image_path'));
        $view->url = $this->request->url();

        $view->props = [
            'routes' => $view->routes,
            'intl' => $view->intl,
            'user' => !is_null($user) ? new UserResource($user) : null,
            'site' => $view->site,
            'pubnubNamespace' => config('broadcasting.connections.pubnub.namespace'),
            'pubnubPublishKey' => config('services.pubnub.publish_key'),
            'pubnubSubscribeKey' => config('services.pubnub.subscribe_key'),
        ];
    }
}
