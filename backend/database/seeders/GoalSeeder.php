<?php

namespace Database\Seeders;

use App\Models\Goal;
use App\Models\User;
use Illuminate\Database\Seeder;

class GoalSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        foreach ($users as $user) {
            // Mỗi user có 2-4 goals
            Goal::factory()
                ->count(rand(1, 2))
                ->withUser($user)
                ->create();
        }

        // Tạo một vài completed goals
        Goal::factory()
            ->count(2)
            ->completed()
            ->create();
    }
}