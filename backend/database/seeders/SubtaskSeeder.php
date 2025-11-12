<?php

namespace Database\Seeders;

use App\Models\Subtask;
use App\Models\Task;
use Illuminate\Database\Seeder;

class SubtaskSeeder extends Seeder
{
    public function run(): void
    {
        $tasks = Task::all();

        foreach ($tasks as $task) {
            // Mỗi task có 2-5 subtasks
            Subtask::factory()
                ->count(rand(2, 5))
                ->create([
                    'task_id' => $task->id,
                ]);
        }

        // Đánh dấu một số subtasks là completed
        $subtasks = Subtask::all()->random(20);
        foreach ($subtasks as $subtask) {
            $subtask->markAsCompleted();
        }
    }
}