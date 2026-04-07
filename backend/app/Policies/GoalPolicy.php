<?php

namespace App\Policies;

use App\Models\Goal;
use App\Models\User;

class GoalPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->exists;
    }

    public function view(User $user, Goal $goal): bool
    {
        return (int) $user->id === (int) $goal->user_id;
    }

    public function create(User $user): bool
    {
        return $user->exists;
    }

    public function update(User $user, Goal $goal): bool
    {
        return (int) $user->id === (int) $goal->user_id;
    }

    public function delete(User $user, Goal $goal): bool
    {
        return (int) $user->id === (int) $goal->user_id;
    }
}
