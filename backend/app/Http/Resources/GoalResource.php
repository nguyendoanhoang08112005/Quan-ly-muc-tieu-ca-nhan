<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GoalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'title' => $this->title,
            'description' => $this->description,
            'goal_type' => $this->goal_type,
            'priority' => $this->priority,
            'status' => $this->status,
            'start_date' => $this->start_date?->toDateString(),
            'target_date' => $this->target_date?->toDateString(),
            'due_date' => $this->target_date?->toDateString(),
            'note' => $this->note,
            'progress_percentage' => (float) $this->progress_percentage,
            'progress' => (float) $this->progress_percentage,
            'tasks_count' => $this->whenCounted('tasks'),
            'milestones_count' => $this->whenCounted('milestones'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
