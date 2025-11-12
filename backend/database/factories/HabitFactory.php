<?php

namespace Database\Factories;

use App\Models\Goal;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class HabitFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'goal_id' => Goal::inRandomOrder()->first()->id ?? Goal::factory(),
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->sentence(),
            'frequency' => $this->faker->randomElement(['daily', 'weekly', 'monthly']),
            'target_count' => $this->faker->numberBetween(1, 3),
            'current_streak' => $this->faker->numberBetween(0, 30),
            'best_streak' => $this->faker->numberBetween(0, 60),
            'is_active' => $this->faker->boolean(80),
        ];
    }

    public function daily(): static
    {
        return $this->state(fn(array $attributes) => [
            'frequency' => 'daily',
        ]);
    }

    public function weekly(): static
    {
        return $this->state(fn(array $attributes) => [
            'frequency' => 'weekly',
        ]);
    }

    public function monthly(): static
    {
        return $this->state(fn(array $attributes) => [
            'frequency' => 'monthly',
        ]);
    }

    public function active(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_active' => true,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_active' => false,
        ]);
    }

    public function withUser(User $user): static
    {
        return $this->state(fn(array $attributes) => [
            'user_id' => $user->id,
        ]);
    }

    public function withGoal(Goal $goal): static
    {
        return $this->state(fn(array $attributes) => [
            'goal_id' => $goal->id,
            'user_id' => $goal->user_id,
        ]);
    }
}
