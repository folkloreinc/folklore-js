<?php

namespace App\Panneau\Http\Controllers;

use Illuminate\Http\Request;
use Panneau\Http\Controllers\ResourceController;
use Panneau\Contracts\Resource;

class UsersController extends ResourceController
{
    protected $defaultPageCount = 100;

    protected function getResourceFromRequest(Request $request)
    {
        return app('panneau')->resource('users');
    }

    protected function getIndexQueryFromRequest(Request $request, Resource $resource)
    {
        $query = parent::getIndexQueryFromRequest($request, $resource);

        if (!isset($query['order'])) {
            $query['order'] = 'created_at';
        }

        if (!isset($query['role'])) {
            $query['role'] = 'admin';
        }

        return $query;
    }
}
