<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Carbon;

class DashboardService
{
    public function summaryForUser(User $user): array
    {
        $today = Carbon::now($user->timezone ?? config('app.timezone'));
        $startOfDay = $today->copy()->startOfDay();
        $endOfDay = $today->copy()->endOfDay();
        $upcomingEnd = $today->copy()->addDays(7)->endOfDay();

        $activeGoalsQuery = $user->goals()->active();
        $tasksQuery = $user->tasks()->whereNotNull('due_at');

        $activeGoals = (clone $activeGoalsQuery)
            ->withCount(['tasks', 'milestones'])
            ->orderByRaw("
                case
                    when status = 'in_progress' then 0
                    when status = 'not_started' then 1
                    when status = 'paused' then 2
                    else 3
                end
            ")
            ->orderBy('target_date')
            ->limit(4)
            ->get();

        $upcomingTasks = (clone $tasksQuery)
            ->whereBetween('due_at', [$startOfDay, $upcomingEnd])
            ->where('status', '!=', 'completed')
            ->with([
                'goal:id,title',
                'milestone:id,title',
            ])
            ->orderBy('due_at')
            ->limit(6)
            ->get();

        return [
            'summary' => [
                'active_goals' => (clone $activeGoalsQuery)->count(),
                'completed_goals' => $user->goals()->completed()->count(),
                'tasks_today' => (clone $tasksQuery)
                    ->whereBetween('due_at', [$startOfDay, $endOfDay])
                    ->where('status', '!=', 'completed')
                    ->count(),
                'overdue_tasks' => (clone $tasksQuery)
                    ->where('due_at', '<', $startOfDay)
                    ->where('status', '!=', 'completed')
                    ->count(),
            ],
            'upcoming_tasks' => $upcomingTasks,
            'active_goals' => $activeGoals,
        ];
    }
}
