<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'deadline',
        'progress',
        'status',
        'color',
        'is_public',
        'shared_with',
        'smart_specific',
        'smart_measurable',
        'smart_achievable',
        'smart_relevant',
        'smart_time_bound',
    ];

    protected $casts = [
        'deadline' => 'date',
        'progress' => 'decimal:2',
        'is_public' => 'boolean',
        'shared_with' => 'array',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function habits()
    {
        return $this->hasMany(Habit::class);
    }

    public function notes()
    {
        return $this->morphMany(Note::class, 'noteable');
    }

    public function follows()
    {
        return $this->morphMany(Follow::class, 'followable');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    public function scopeWithProgress($query, $minProgress = 0)
    {
        return $query->where('progress', '>=', $minProgress);
    }

    // Methods
    public function updateProgress()
    {
        $totalTasks = $this->tasks()->count();
        if ($totalTasks === 0) {
            $this->update(['progress' => 0]);
            return;
        }

        $completedTasks = $this->tasks()->where('status', 'done')->count();
        $progress = ($completedTasks / $totalTasks) * 100;
        
        $this->update(['progress' => round($progress, 2)]);
    }

    public function isSharedWith(User $user)
    {
        if (!$this->shared_with) {
            return false;
        }

        return collect($this->shared_with)->contains('user_id', $user->id);
    }
}