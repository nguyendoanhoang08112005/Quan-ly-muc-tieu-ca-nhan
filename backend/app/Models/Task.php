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

    // Relationships
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function goal()
    {
        return $this->belongsTo(Goal::class);
    }

    public function parentTask()
    {
        return $this->belongsTo(Task::class, 'parent_task_id');
    }

    public function subtasks()
    {
        return $this->hasMany(Task::class, 'parent_task_id');
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    public function notes()
    {
        return $this->morphMany(Note::class, 'noteable');
    }

    public function pomodoroSessions()
    {
        return $this->hasMany(PomodoroSession::class);
    }

    public function simpleSubtasks()
    {
        return $this->hasMany(Subtask::class);
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

    public function scopeAssignedTo($query, User $user)
    {
        return $query->where('assignee_id', $user->id);
    }

    // Methods
    public function markAsCompleted()
    {
        $this->update([
            'status' => 'done',
            'completed_at' => now(),
        ]);

        // Update parent project progress
        if ($this->project) {
            $this->project->updateProgress();
        }

        // Update parent goal progress
        if ($this->goal) {
            $this->goal->updateProgress();
        }
    }

    public function isOverdue()
    {
        return $this->due_date && $this->due_date->isPast() && $this->status !== 'done';
    }

    public function getProgressPercentage()
    {
        $totalSubtasks = $this->simpleSubtasks()->count();
        if ($totalSubtasks === 0) {
            return $this->status === 'done' ? 100 : 0;
        }

        $completedSubtasks = $this->simpleSubtasks()->where('status', 'completed')->count();
        return round(($completedSubtasks / $totalSubtasks) * 100, 2);
    }
}