<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MilestoneResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'goal_id' => $this->goal_id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'progress_percentage' => (float) $this->progress_percentage,
            'progress' => (float) $this->progress_percentage,
            'start_date' => $this->start_date?->toDateString(),
            'target_date' => $this->target_date?->toDateString(),
            'completed_at' => $this->completed_at,
            'sequence_no' => $this->sequence_no,
            'note' => $this->note,
            'tasks_count' => $this->whenCounted('tasks'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
