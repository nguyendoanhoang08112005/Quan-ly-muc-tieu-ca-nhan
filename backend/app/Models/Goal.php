<?php

namespace App\Models;

use App\Services\GoalProgressService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Goal extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'slug',
        'description',
        'goal_type',
        'priority',
        'status',
        'progress_percentage',
        'start_date',
        'target_date',
        'completed_at',
        'success_metric',
        'outcome_note',
        'note',
        'is_archived',
        'is_recurring',
        'recurrence_rule',
        'sort_order',
    ];

    protected $casts = [
        'start_date' => 'date',
        'target_date' => 'date',
        'completed_at' => 'datetime',
        'progress_percentage' => 'decimal:2',
        'is_archived' => 'boolean',
        'is_recurring' => 'boolean',
        'recurrence_rule' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function milestones(): HasMany
    {
        return $this->hasMany(Milestone::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'goal_tag')->withTimestamps();
    }

    public function logs(): HasMany
    {
        return $this->hasMany(GoalLog::class);
    }

    public function scopeActive($query)
    {
        return $query
            ->where('is_archived', false)
            ->whereIn('status', ['not_started', 'in_progress', 'paused']);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function updateProgress(): void
    {
        app(GoalProgressService::class)->syncGoal($this);
    }
}
