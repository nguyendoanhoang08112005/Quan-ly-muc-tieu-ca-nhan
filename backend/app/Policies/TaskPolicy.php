<?php

namespace App\Policies;

use App\Models\Milestone;
use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    public function create(User $user, Milestone $milestone): bool
    {
        return (int) $user->id === (int) $milestone->user_id;
    }

    public function view(User $user, Task $task): bool
    {
        return (int) $user->id === (int) $task->user_id;
    }

    public function update(User $user, Task $task): bool
    {
        return (int) $user->id === (int) $task->user_id;
    }

    public function delete(User $user, Task $task): bool
    {
        return (int) $user->id === (int) $task->user_id;
    }

    public function complete(User $user, Task $task): bool
    {
        return (int) $user->id === (int) $task->user_id;
    }
}
