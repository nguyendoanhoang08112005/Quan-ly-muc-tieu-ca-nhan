<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Follow extends Model
{
    use HasFactory;

    protected $fillable = [
        'follower_id',
        'followable_type',
        'followable_id',
    ];

    // Relationships
    public function follower()
    {
        return $this->belongsTo(User::class, 'follower_id');
    }

    public function followable()
    {
        return $this->morphTo();
    }

    // Scopes
    public function scopeGoals($query)
    {
        return $query->where('followable_type', Goal::class);
    }
}