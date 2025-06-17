<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'access admins',
            'access all forms',
            'access unassigned forms',
            'access my forms',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        $superAdmin = Role::where('name', 'super admin')->first();
        $admin = Role::where('name', 'admin')->first();

        // Assign all permissions to super admin
        if ($superAdmin) {
            $superAdmin->syncPermissions(Permission::all());
        }

        // Assign specific permissions to admin
        if ($admin) {
            $admin->syncPermissions([
                'access unassigned forms',
                'access my forms',
            ]);
        }
    }
}
