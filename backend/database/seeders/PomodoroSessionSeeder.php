<?php

namespace Database\Seeders;

use App\Models\PomodoroSession;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class PomodoroSessionSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $tasks = Task::all();

        foreach ($users as $user) {
            // Mỗi user có 5-10 pomodoro sessions
            PomodoroSession::factory()
                ->count(rand(5, 10))
                ->create([
                    'user_id' => $user->id,
                    'task_id' => $tasks->random()->id,
                ]);
        }

        // Tạo một số sessions completed
        PomodoroSession::factory()
            ->count(15)
            ->completed()
            ->create();
    }
}