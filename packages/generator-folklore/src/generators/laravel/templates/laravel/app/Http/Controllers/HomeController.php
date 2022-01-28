<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function show(Request $request)
    {
        return view('app');
    }

    public function redirect(Request $request)
    {
        $queryString = $request->getQueryString();
        $url = route(app()->getLocale().'.home').(!empty($queryString) ? '?'.$queryString : '');
        return redirect()->to($url);
    }
}
