<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        return view('app');
    }

    public function redirect(Request $request)
    {
        return redirect()->to(app('url')->routeWithLocale('home'));
    }
}
