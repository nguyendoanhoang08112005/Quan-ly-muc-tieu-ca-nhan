<?php

namespace Database\Factories;

use App\Models\Goal;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('-1 month', 'now');
        $endDate = $this->faker->dateTimeBetween($startDate, '+2 months');

        return [
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'goal_id' => Goal::inRandomOrder()->first()->id ?? Goal::factory(),
            'name' => $this->faker->words(3, true) . ' Project',
            'description' => $this->faker->paragraph(2),
            'status' => $this->faker->randomElement(['planning', 'active', 'completed']),
            'color' => $this->faker->hexColor(),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'progress' => $this->faker->randomFloat(2, 0, 100),
        ];
    }

    public function active(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'active',
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'completed',
            'progress' => 100,
        ]);
    }
}
