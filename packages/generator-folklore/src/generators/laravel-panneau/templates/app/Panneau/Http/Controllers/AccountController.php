<?php

namespace App\Panneau\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Panneau\Http\Requests\AccountUpdateRequest;
use Folklore\Contracts\Repositories\Users as UsersRepository;

class AccountController extends Controller
{
    protected $users;

    public function __construct(UsersRepository $users)
    {
        $this->users = $users;
    }

    /**
     * Show the account
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        return view('panneau::app');
    }

    /**
     * Update the account
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function update(AccountUpdateRequest $request)
    {
        $data = $request->all();
        $user = $request->user();
        $user = $this->users->update($user->id(), $data);
        return new UserResource($user);
    }
}
