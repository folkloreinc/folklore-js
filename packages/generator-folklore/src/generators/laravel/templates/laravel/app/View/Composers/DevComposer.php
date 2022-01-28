<?php

namespace App\View\Composers;

use Illuminate\Http\Request;
use Illuminate\View\View;

class DevComposer
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
        $view->with('inWebpack', $this->request->header('x-webpack-dev-server', false) === 'true');
    }
}
