<?php

namespace Database\Seeders;

use App\Models\Goal;
use App\Models\Milestone;
use Illuminate\Database\Seeder;

class MilestoneSeeder extends Seeder
{
    public function run(): void
    {
        $goals = Goal::query()->get();

        foreach ($goals as $goal) {
            $milestones = [
                [
                    'title' => 'Chot schema va relation',
                    'status' => 'completed',
                    'progress_percentage' => 100,
                    'target_date' => now()->addDays(3)->toDateString(),
                ],
                [
                    'title' => 'San sang cho API',
                    'status' => 'in_progress',
                    'progress_percentage' => 50,
                    'target_date' => now()->addDays(7)->toDateString(),
                ],
            ];

            foreach ($milestones as $index => $milestone) {
                Milestone::create([
                    'user_id' => $goal->user_id,
                    'goal_id' => $goal->id,
                    'title' => $milestone['title'],
                    'description' => 'Moc tien do mau cho goal hien tai.',
                    'status' => $milestone['status'],
                    'progress_percentage' => $milestone['progress_percentage'],
                    'start_date' => now()->toDateString(),
                    'target_date' => $milestone['target_date'],
                    'completed_at' => $milestone['status'] === 'completed' ? now() : null,
                    'sequence_no' => $index + 1,
                    'note' => 'Seeder cho relation Goal -> Milestone -> Task.',
                ]);
            }
        }
    }
}
