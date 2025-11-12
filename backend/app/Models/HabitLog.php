<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HabitLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'habit_id',
        'user_id',
        'logged_date',
        'completed',
        'notes',
    ];

    protected $casts = [
        'logged_date' => 'date',
        'completed' => 'boolean',
    ];

    // Relationships
    public function habit()
    {
        return $this->belongsTo(Habit::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Methods
    public function markAsCompleted($notes = null)
    {
        $this->update([
            'completed' => true,
            'notes' => $notes,
        ]);

        $this->habit->updateStreak();
    }
}