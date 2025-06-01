<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        // Clear cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Define permissions
        $users_permissions = [
            'view users',
            'edit users',
            'delete users',
            'create users',
        ];
        foreach ($users_permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }
        $user = Role::firstOrCreate(['name' => 'user']);
        $user->syncPermissions($users_permissions);

        // Create roles and assign permissions
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->syncPermissions(Permission::all());

    }
}
