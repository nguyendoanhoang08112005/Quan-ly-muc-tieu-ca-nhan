<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class FollowFactory extends Factory
{
    public function definition(): array
    {
        $followable = \App\Models\Goal::factory()->create(['is_public' => true]);
        
        return [
            'follower_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'followable_type' => get_class($followable),
            'followable_id' => $followable->id,
        ];
    }

    public function forGoal($goal = null): static
    {
        $goal = $goal ?: \App\Models\Goal::factory()->create(['is_public' => true]);
        
        return $this->state(fn (array $attributes) => [
            'followable_type' => \App\Models\Goal::class,
            'followable_id' => $goal->id,
        ]);
    }

    public function withFollower($user): static
    {
        return $this->state(fn (array $attributes) => [
            'follower_id' => $user->id,
        ]);
    }
}