<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'goal_id',
        'milestone_id',
        'title',
        'description',
        'status',
        'priority',
        'progress_percentage',
        'due_at',
        'started_at',
        'completed_at',
        'estimated_minutes',
        'actual_minutes',
        'is_focus',
        'sort_order',
        'metadata',
    ];

    protected $casts = [
        'progress_percentage' => 'decimal:2',
        'due_at' => 'datetime',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'is_focus' => 'boolean',
        'metadata' => 'array',
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

    public function logs(): HasMany
    {
        return $this->hasMany(GoalLog::class);
    }

    public function scopeTodo($query)
    {
        return $query->where('status', 'not_started');
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    public function scopeDone($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeHighPriority($query)
    {
        return $query->whereIn('priority', ['high', 'critical']);
    }

    public function scopeOverdue($query)
    {
        return $query->where('due_at', '<', now())
            ->where('status', '!=', 'completed');
    }

    public function markAsCompleted()
    {
        $this->update([
            'status' => 'completed',
            'progress_percentage' => 100,
            'completed_at' => now(),
        ]);
    }

    public function isOverdue()
    {
        return $this->due_at && $this->due_at->isPast() && $this->status !== 'completed';
    }
}
