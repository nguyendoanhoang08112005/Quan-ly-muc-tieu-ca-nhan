<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class GoalFactory extends Factory
{
    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('-1 month', '+1 month');
        $endDate = $this->faker->dateTimeBetween($startDate, '+3 months');
        
        return [
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'name' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph(3),
            'deadline' => $endDate,
            'progress' => $this->faker->randomFloat(2, 0, 100),
            'status' => $this->faker->randomElement(['active', 'completed', 'on_hold']),
            'color' => $this->faker->hexColor(),
            'is_public' => $this->faker->boolean(30),
            'smart_specific' => $this->faker->sentence(),
            'smart_measurable' => $this->faker->sentence(),
            'smart_achievable' => $this->faker->sentence(),
            'smart_relevant' => $this->faker->sentence(),
            'smart_time_bound' => $this->faker->sentence(),
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'progress' => 100,
        ]);
    }

    public function withUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }
}