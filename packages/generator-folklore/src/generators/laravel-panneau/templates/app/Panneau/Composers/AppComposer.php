<?php

namespace App\Panneau\Composers;

use Illuminate\Http\Request;
use Illuminate\View\View;
use App\Panneau\Http\Resources\UserResource;

class AppComposer
{
    /**
     * The request
     *
     * @var \Illuminate\Http\Request
     */
    protected $request;

    protected $panneau;

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

        $view->props = array_merge(isset($view->props) ? $view->props : [], [
            'user' => !is_null($user) ? new UserResource($user) : null,
            'isPanneau' => true,
            'statusCode' => $view->statusCode,
            'pubnubNamespace' => config('services.pubnub.namespace'),
            'pubnubPublishKey' => config('services.pubnub.publish_key'),
            'pubnubSubscribeKey' => config('services.pubnub.subscribe_key'),
        ]);
    }
}
