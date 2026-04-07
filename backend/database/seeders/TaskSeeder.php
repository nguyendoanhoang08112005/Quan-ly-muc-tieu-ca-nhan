<?php

namespace Database\Seeders;

use App\Models\Goal;
use App\Models\Milestone;
use App\Models\Task;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        $goals = Goal::all();

        foreach ($goals as $goal) {
            $milestones = Milestone::query()
                ->where('goal_id', $goal->id)
                ->orderBy('sequence_no')
                ->get();

            $tasks = [
                [
                    'title' => 'Viet migration cho schema moi',
                    'status' => 'completed',
                    'priority' => 'high',
                    'progress_percentage' => 100,
                    'due_at' => now()->subDay(),
                    'started_at' => now()->subDays(3),
                    'completed_at' => now()->subDay(),
                    'milestone_id' => $milestones->get(0)?->id,
                ],
                [
                    'title' => 'Kiem tra migrate:fresh',
                    'status' => 'in_progress',
                    'priority' => 'critical',
                    'progress_percentage' => 60,
                    'due_at' => now()->addDay(),
                    'started_at' => now()->subHours(6),
                    'completed_at' => null,
                    'milestone_id' => $milestones->get(1)?->id,
                ],
                [
                    'title' => 'Chuan bi API goals',
                    'status' => 'not_started',
                    'priority' => 'medium',
                    'progress_percentage' => 0,
                    'due_at' => now()->addDays(3),
                    'started_at' => null,
                    'completed_at' => null,
                    'milestone_id' => null,
                ],
            ];

            foreach ($tasks as $index => $task) {
                Task::create([
                    'user_id' => $goal->user_id,
                    'goal_id' => $goal->id,
                    'milestone_id' => $task['milestone_id'],
                    'title' => $task['title'],
                    'description' => 'Du lieu mau gan voi goal hien tai.',
                    'status' => $task['status'],
                    'priority' => $task['priority'],
                    'progress_percentage' => $task['progress_percentage'],
                    'due_at' => $task['due_at'],
                    'started_at' => $task['started_at'],
                    'completed_at' => $task['completed_at'],
                    'estimated_minutes' => 90,
                    'actual_minutes' => $task['completed_at'] ? 75 : null,
                    'is_focus' => $index === 1,
                    'sort_order' => $index,
                ]);
            }
        }
    }
}
