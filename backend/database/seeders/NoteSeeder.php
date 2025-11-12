<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NoteSeeder extends Seeder
{
    public function run(): void
    {
        $notes = [];

        // Lấy 20 tasks ngẫu nhiên
        $tasks = DB::table('tasks')->inRandomOrder()->limit(20)->get();
        foreach ($tasks as $task) {
            $notes[] = [
                'user_id' => $task->assignee_id ?? $task->project_id ? 
                    DB::table('projects')->where('id', $task->project_id)->value('user_id') : 
                    DB::table('users')->inRandomOrder()->value('id'),
                'noteable_type' => 'App\Models\Task',
                'noteable_id' => $task->id,
                'content' => 'Task note: ' . $task->title,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Lấy 10 goals ngẫu nhiên
        $goals = DB::table('goals')->inRandomOrder()->limit(10)->get();
        foreach ($goals as $goal) {
            $notes[] = [
                'user_id' => $goal->user_id,
                'noteable_type' => 'App\Models\Goal',
                'noteable_id' => $goal->id,
                'content' => 'Goal note: ' . $goal->name,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('notes')->insert($notes);
        $this->command->info("✅ Created " . count($notes) . " notes instantly!");
    }
}