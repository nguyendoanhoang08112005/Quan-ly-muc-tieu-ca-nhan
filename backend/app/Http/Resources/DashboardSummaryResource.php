<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardSummaryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'summary' => [
                'active_goals' => (int) ($this['summary']['active_goals'] ?? 0),
                'completed_goals' => (int) ($this['summary']['completed_goals'] ?? 0),
                'tasks_today' => (int) ($this['summary']['tasks_today'] ?? 0),
                'overdue_tasks' => (int) ($this['summary']['overdue_tasks'] ?? 0),
            ],
            'upcoming_tasks' => collect($this['upcoming_tasks'] ?? [])->map(function ($task) {
                return [
                    'id' => $task->id,
                    'title' => $task->title,
                    'description' => $task->description,
                    'status' => $task->status,
                    'priority' => $task->priority,
                    'due_at' => $task->due_at?->toISOString(),
                    'estimated_minutes' => $task->estimated_minutes,
                    'is_focus' => (bool) $task->is_focus,
                    'goal' => $task->goal ? [
                        'id' => $task->goal->id,
                        'title' => $task->goal->title,
                    ] : null,
                    'milestone' => $task->milestone ? [
                        'id' => $task->milestone->id,
                        'title' => $task->milestone->title,
                    ] : null,
                ];
            })->values(),
            'active_goals' => GoalResource::collection($this['active_goals'] ?? []),
        ];
    }
}
