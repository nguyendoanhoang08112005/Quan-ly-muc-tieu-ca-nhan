<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Habit extends Model
{
    use HasFactory;

    protected $fillable = [
        'goal_id',
        'user_id',
        'name',
        'description',
        'frequency',
        'target_count',
        'current_streak',
        'best_streak',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Relationships
    public function goal()
    {
        return $this->belongsTo(Goal::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function habitLogs()
    {
        return $this->hasMany(HabitLog::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeDaily($query)
    {
        return $query->where('frequency', 'daily');
    }

    // Methods
    public function logForToday()
    {
        return $this->habitLogs()
                    ->whereDate('logged_date', today())
                    ->first();
    }

    public function getTodayCompletion()
    {
        $todayLog = $this->logForToday();
        return $todayLog ? $todayLog->completed : false;
    }

    public function updateStreak()
    {
        $recentLogs = $this->habitLogs()
                          ->where('completed', true)
                          ->orderBy('logged_date', 'desc')
                          ->get();

        $currentStreak = 0;
        $currentDate = today();

        foreach ($recentLogs as $log) {
            if ($log->logged_date->eq($currentDate)) {
                $currentStreak++;
                $currentDate = $currentDate->subDay();
            } else {
                break;
            }
        }

        $this->update([
            'current_streak' => $currentStreak,
            'best_streak' => max($currentStreak, $this->best_streak),
        ]);
    }
}