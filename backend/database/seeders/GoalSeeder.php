<?php

namespace Database\Seeders;

use App\Models\Goal;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class GoalSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        foreach ($users as $user) {
            $goals = [
                [
                    'title' => 'Hoan thanh flow auth',
                    'goal_type' => 'short_term',
                    'priority' => 'high',
                    'status' => 'in_progress',
                    'progress_percentage' => 40,
                    'target_date' => now()->addDays(7)->toDateString(),
                ],
                [
                    'title' => 'CRUD muc tieu ca nhan',
                    'goal_type' => 'mid_term',
                    'priority' => 'critical',
                    'status' => 'not_started',
                    'progress_percentage' => 0,
                    'target_date' => now()->addDays(14)->toDateString(),
                ],
            ];

            foreach ($goals as $goal) {
                Goal::create([
                    'user_id' => $user->id,
                    'title' => $goal['title'],
                    'slug' => Str::slug($goal['title'].'-'.$user->id),
                    'description' => 'Du lieu mau cho flow auth -> goals -> tasks.',
                    'goal_type' => $goal['goal_type'],
                    'priority' => $goal['priority'],
                    'status' => $goal['status'],
                    'progress_percentage' => $goal['progress_percentage'],
                    'start_date' => now()->toDateString(),
                    'target_date' => $goal['target_date'],
                    'success_metric' => 'Hoan thanh cac task lien quan',
                    'sort_order' => 0,
                ]);
            }
        }

        $firstUser = User::query()->first();

        if ($firstUser) {
            Goal::create([
                'user_id' => $firstUser->id,
                'title' => 'Don scope repo',
                'slug' => Str::slug('Don scope repo-'.$firstUser->id),
                'description' => 'Mau goal da hoan thanh.',
                'goal_type' => 'short_term',
                'priority' => 'medium',
                'status' => 'completed',
                'progress_percentage' => 100,
                'start_date' => now()->subDays(10)->toDateString(),
                'target_date' => now()->subDays(2)->toDateString(),
                'completed_at' => now()->subDay(),
                'success_metric' => 'Repo tap trung vao quan ly muc tieu ca nhan',
                'outcome_note' => 'Scope active da duoc khoa lai.',
                'sort_order' => 1,
            ]);
        }
    }
}
