<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Demo User',
                'email' => 'demo@example.com',
            ],
            [
                'name' => 'Lan Nguyen',
                'email' => 'lan@example.com',
            ],
            [
                'name' => 'Minh Tran',
                'email' => 'minh@example.com',
            ],
            [
                'name' => 'An Pham',
                'email' => 'an@example.com',
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                [
                    'name' => $user['name'],
                    'password' => Hash::make('password'),
                    'timezone' => 'Asia/Ho_Chi_Minh',
                    'locale' => 'vi',
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}
