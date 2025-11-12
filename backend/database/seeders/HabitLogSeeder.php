<?php

namespace Database\Seeders;

use App\Models\Habit;
use App\Models\HabitLog;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HabitLogSeeder extends Seeder
{
    public function run(): void
    {
        $habits = Habit::all();
        $habitLogs = [];

        foreach ($habits as $habit) {
            // CHỈ 7 ngày gần nhất
            for ($i = 0; $i < 7; $i++) {
                $date = Carbon::now()->subDays(7 - $i);
                $completed = rand(0, 100) < 70;

                $habitLogs[] = [
                    'habit_id' => $habit->id,
                    'user_id' => $habit->user_id,
                    'logged_date' => $date,
                    'completed' => $completed,
                    'notes' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        // MASS INSERT - 1 query duy nhất!
        DB::table('habit_logs')->insert($habitLogs);

        // Update streaks (có thể bỏ qua nếu quá chậm)
        // foreach ($habits as $habit) {
        //     $habit->updateStreak();
        // }

        // $totalLogs = $habits->count() * 7;
        // $this->command->info("✅ Created {$totalLogs} habit logs in one query!");
    }
}