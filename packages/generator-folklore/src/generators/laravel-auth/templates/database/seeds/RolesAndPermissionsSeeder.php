<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    protected function permissions()
    {
        return [
            'panneau' => ['view', 'settings'],
            'users' => ['list', 'create', 'delete', 'view', 'update'],
        ];
    }

    protected function roles()
    {
        return [
            'user' => ['account'],
            'admin' => ['account', 'users', 'panneau'],
            'super-admin' => '*',
        ];
    }

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Reset cached roles and permissions
        resolve(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        // Get all permissions name
        foreach ($this->getAllPermissions() as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        foreach ($this->getRolesWithPermissions() as $name => $permissions) {
            $role = Role::firstOrCreate(['name' => $name]);
            $role->givePermissionTo($permissions);
        }
    }

    protected function getAllPermissions()
    {
        $permissions = $this->permissions();
        return array_reduce(
            array_keys($permissions),
            function ($all, $resource) use ($permissions) {
                $actions = $permissions[$resource];
                return array_merge(
                    $all,
                    is_array($actions)
                        ? $this->getResourcePermissions($resource, $actions)
                        : [$actions]
                );
            },
            []
        );
    }

    protected function getRolesWithPermissions()
    {
        $roles = $this->roles();
        return array_reduce(
            array_keys($roles),
            function ($all, $role) use ($roles) {
                $all[$role] = $this->getRolePermissions($roles[$role]);
                return $all;
            },
            []
        );
    }

    protected function getRolePermissions($rolePermissions)
    {
        if ($rolePermissions === '*') {
            return $this->getAllPermissions();
        }
        $permissions = $this->permissions();
        return array_reduce(
            $rolePermissions,
            function ($all, $permission) use ($permissions) {
                return array_merge(
                    $all,
                    isset($permissions[$permission]) && is_array($permissions[$permission])
                        ? $this->getResourcePermissions($permission, $permissions[$permission])
                        : [$permission]
                );
            },
            []
        );
    }

    protected function getResourcePermissions($resource, $actions)
    {
        return array_map(function ($action) use ($resource) {
            return $action . '-' . $resource;
        }, $actions);
    }
}
