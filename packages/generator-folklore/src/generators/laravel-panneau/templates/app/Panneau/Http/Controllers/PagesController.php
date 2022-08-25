<?php

namespace App\Panneau\Http\Controllers;

use Illuminate\Http\Request;
use Panneau\Contracts\Resource;
use Panneau\Http\Controllers\ResourceController;

class PagesController extends ResourceController
{
    protected $defaultPageCount = 25;

    protected function getResourceFromRequest(Request $request)
    {
        return app('panneau')->resource('pages');
    }

    protected function getIndexQueryFromRequest(Request $request, Resource $resource)
    {
        $query = parent::getIndexQueryFromRequest($request, $resource);

        return $query;
    }
}
