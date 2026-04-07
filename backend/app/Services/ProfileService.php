<?php

namespace App\Services;

use App\Models\User;

class ProfileService
{
    public function update(User $user, array $data): User
    {
        $user->fill($data);
        $user->save();

        return $user->refresh();
    }
}
