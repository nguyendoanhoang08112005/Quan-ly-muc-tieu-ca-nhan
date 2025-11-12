<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        foreach ($users as $user) {
            // Mỗi user có 5-15 notifications
            Notification::factory()
                ->count(rand(5, 15))
                ->create([
                    'user_id' => $user->id,
                ]);
        }

        // Đảm bảo có một số unread notifications
        Notification::factory()
            ->count(10)
            ->unread()
            ->create();
    }
}