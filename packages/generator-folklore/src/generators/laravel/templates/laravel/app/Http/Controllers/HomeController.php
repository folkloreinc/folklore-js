<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        return view('root');
    }

    public function redirect(Request $request)
    {
        $queryString = $request->getQueryString();
        $url = route('home.'.app()->getLocale()).(!empty($queryString) ? '?'.$queryString : '');
        return redirect()->to($url);
    }
}
