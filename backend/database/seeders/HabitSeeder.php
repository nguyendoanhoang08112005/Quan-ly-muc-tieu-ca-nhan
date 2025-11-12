<?php

namespace Database\Seeders;

use App\Models\Goal;
use App\Models\Habit;
use App\Models\User;
use Illuminate\Database\Seeder;

class HabitSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        foreach ($users as $user) {
            // Mỗi user có 3-6 habits
            $habitsCount = rand(1, 2);
            
            Habit::factory()
                ->count($habitsCount)
                ->withUser($user)
                ->create();
        }

        // Tạo một số habits có goal
        $goals = Goal::all()->random(5);
        foreach ($goals as $goal) {
            Habit::factory()
                ->count(rand(1, 2))
                ->withGoal($goal)
                ->create();
        }

        // Đảm bảo có một số inactive habits
        Habit::factory()
            ->count(3)
            ->inactive()
            ->create();
    }
}