<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        return view('root');
    }

    public function redirect()
    {
        return redirect()->route('home.'.app()->getLocale());
    }
}
