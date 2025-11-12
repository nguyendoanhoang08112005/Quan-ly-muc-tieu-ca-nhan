<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            GoalSeeder::class,
            ProjectSeeder::class,
            TaskSeeder::class,
            SubtaskSeeder::class,
            HabitSeeder::class,
            HabitLogSeeder::class,
            NoteSeeder::class,
            NotificationSeeder::class,
            PomodoroSessionSeeder::class,
            FollowSeeder::class,
        ]);
    }
}