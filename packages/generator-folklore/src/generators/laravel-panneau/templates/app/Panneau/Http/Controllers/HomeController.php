<?php

namespace App\Panneau\Http\Controllers;

class HomeController extends Controller
{
    /**
     * Show the home
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        return view('panneau::app');
    }
}
