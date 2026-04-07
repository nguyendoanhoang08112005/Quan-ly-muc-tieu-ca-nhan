<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'goal_id',
        'parent_task_id',
        'assignee_id',
        'title',
        'description',
        'status',
        'priority',
        'due_date',
        'completed_at',
        'estimated_hours',
        'actual_hours',
        'order',
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'completed_at' => 'datetime',
        'estimated_hours' => 'decimal:2',
        'actual_hours' => 'decimal:2',
    ];

    // Step 1 scope: Task is treated as personal work attached to a goal.
    public function goal()
    {
        return $this->belongsTo(Goal::class);
    }

    // Scopes
    public function scopeTodo($query)
    {
        return $query->where('status', 'todo');
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    public function scopeDone($query)
    {
        return $query->where('status', 'done');
    }

    public function scopeHighPriority($query)
    {
        return $query->where('priority', 'high')->orWhere('priority', 'urgent');
    }

    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now())
                    ->where('status', '!=', 'done');
    }

    public function markAsCompleted()
    {
        $this->update([
            'status' => 'done',
            'completed_at' => now(),
        ]);

        if ($this->goal) {
            $this->goal->updateProgress();
        }
    }

    public function isOverdue()
    {
        return $this->due_date && $this->due_date->isPast() && $this->status !== 'done';
    }
}
