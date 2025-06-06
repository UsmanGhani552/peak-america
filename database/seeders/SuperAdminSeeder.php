<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::updateOrCreate(
            ['email' => 'superadmin@example.com'],
            [
                'name' => 'Super Admin',
                'email' => 'superadmin@peakamerica.com',
                'password' => Hash::make('admin!@#superdelux'),
                'email_verified_at' => now(),
            ]
        );

        $user->assignRole('Super Admin');
    }
}
