<?php

namespace Database\Seeders;

use App\Models\Goal;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $goals = Goal::all();
        $users = User::all();

        foreach ($goals as $goal) {
            // Mỗi goal có 1-3 projects
            Project::factory()
                ->count(1)
                ->create([
                    'goal_id' => $goal->id,
                    'user_id' => $goal->user_id,
                ]);
        }

        // Tạo một vài projects không có goal
        foreach ($users as $user) {
            Project::factory()
                ->count(rand(1, 2))
                ->create([
                    'goal_id' => null,
                    'user_id' => $user->id,
                ]);
        }
    }
}