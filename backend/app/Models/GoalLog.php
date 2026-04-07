<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GoalLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'goal_id',
        'milestone_id',
        'task_id',
        'log_type',
        'title',
        'content',
        'old_value',
        'new_value',
        'progress_snapshot',
        'logged_at',
    ];

    protected $casts = [
        'old_value' => 'array',
        'new_value' => 'array',
        'progress_snapshot' => 'decimal:2',
        'logged_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function goal(): BelongsTo
    {
        return $this->belongsTo(Goal::class);
    }

    public function milestone(): BelongsTo
    {
        return $this->belongsTo(Milestone::class);
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }
}
