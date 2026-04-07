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

    // Step 1 scope: Goal only stays connected to owner and personal tasks.
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
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
}
