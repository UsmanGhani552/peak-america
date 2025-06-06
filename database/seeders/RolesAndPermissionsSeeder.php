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

        $get_my_form_permission = 'view assigined forms';
        Permission::firstOrCreate(['name' => $get_my_form_permission]);

        $form_permissions = [
            'view forms',
            'assigin form',
            'edit forms',
            'delete forms',
        ];
        foreach ($form_permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $user = Role::firstOrCreate(['name' => 'Admin']);
        $user->syncPermissions($get_my_form_permission);

        // Create roles and assign permissions
        $admin = Role::firstOrCreate(['name' => 'Super Admin']);
        $admin->syncPermissions(Permission::all());
    }
}
