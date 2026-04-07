<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'timezone',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'shared_with' => 'array',
    ];

    // Step 1 scope: keep the active flow focused on personal goals and tasks.
    public function goals()
    {
        return $this->hasMany(Goal::class);
    }

    public function assignedTasks()
    {
        return $this->hasMany(Task::class, 'assignee_id');
    }

    // Scope for active users
    public function scopeActive($query)
    {
        return $query->whereNotNull('email_verified_at');
    }

    // Check if user is admin
    public function isAdmin()
    {
        return $this->role === 'admin';
    }
}
