<?php

namespace App\Panneau\Resources;

use Panneau\Support\Resource;
use Panneau\Fields\Text;
use Panneau\Fields\Email;
use Panneau\Fields\Password;
use Panneau\Fields\Select;

class Users extends Resource
{
    public static $repository = \App\Contracts\Repositories\Users::class;

    public static $controller = \App\Panneau\Http\Controllers\UsersController::class;

    public static $jsonResource = \App\Panneau\Http\Resources\UserResource::class;

    public static $jsonCollection = \App\Panneau\Http\Resources\UsersCollection::class;

    public static $settings = [
        'hideInNavbar' => false,
        'indexIsPaginated' => true,
        'canCreate' => true,
    ];

    public function name(): string
    {
        return trans('panneau.users.name');
    }

    public function index(): ?array
    {
        return [
            'columns' => ['name', 'email', 'role'],
        ];
    }

    public function fields(): array
    {
        return [
            Text::make('name')->withTransLabel('panneau.fields.name'),
            Email::make('email')->withTransLabel('panneau.fields.email'),
            Password::make('password')->withTransLabel('panneau.fields.password'),
            Select::make('role')
                ->withTransLabel('panneau.fields.role')
                ->withOptions([
                    [
                        'value' => 'admin',
                        'label' => trans('panneau.roles.admin'),
                    ],
                ])
                ->withoutReset()
                ->withDefaultValue('admin')
                ->isRequired(),
        ];
    }
}
