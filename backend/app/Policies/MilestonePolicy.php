<?php

namespace App\Policies;

use App\Models\Goal;
use App\Models\Milestone;
use App\Models\User;

class MilestonePolicy
{
    public function viewAny(User $user, Goal $goal): bool
    {
        return (int) $user->id === (int) $goal->user_id;
    }

    public function view(User $user, Milestone $milestone): bool
    {
        return (int) $user->id === (int) $milestone->user_id;
    }

    public function create(User $user, Goal $goal): bool
    {
        return (int) $user->id === (int) $goal->user_id;
    }

    public function update(User $user, Milestone $milestone): bool
    {
        return (int) $user->id === (int) $milestone->user_id;
    }

    public function delete(User $user, Milestone $milestone): bool
    {
        return (int) $user->id === (int) $milestone->user_id;
    }
}
