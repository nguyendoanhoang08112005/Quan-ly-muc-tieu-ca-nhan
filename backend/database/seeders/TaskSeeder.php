<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        $projects = Project::all();
        $users = User::all();

        foreach ($projects as $project) {
            // Mỗi project có 5-10 tasks
            Task::factory()
                ->count(rand(2, 4))
                ->create([
                    'project_id' => $project->id,
                    'goal_id' => $project->goal_id,
                    'assignee_id' => $users->random()->id,
                ]);
        }

        // Tạo một vài tasks không có project (chỉ có goal)
        $goalsWithoutProjects = \App\Models\Goal::has('projects', '=', 0)->get();
        foreach ($goalsWithoutProjects as $goal) {
            Task::factory()
                ->count(rand(2, 5))
                ->create([
                    'project_id' => null,
                    'goal_id' => $goal->id,
                    'assignee_id' => $users->random()->id,
                ]);
        }

        // Tạo một vài tasks overdue
        Task::factory()
            ->count(5)
            ->overdue()
            ->create();
    }
}