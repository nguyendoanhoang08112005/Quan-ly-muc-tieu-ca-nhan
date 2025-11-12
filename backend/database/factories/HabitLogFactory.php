<?php

namespace Database\Factories;

use App\Models\Habit;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

class HabitLogFactory extends Factory
{
    public function definition(): array
    {
        $habit = Habit::factory()->create();

        return [
            'habit_id' => Habit::inRandomOrder()->first()->id ?? Habit::factory(),
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'logged_date' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'completed' => $this->faker->boolean(70),
            'notes' => $this->faker->boolean(30) ? $this->faker->sentence() : null,
        ];
    }

    public function completed(): static
    {
        return $this->state(fn(array $attributes) => [
            'completed' => true,
        ]);
    }

    public function notCompleted(): static
    {
        return $this->state(fn(array $attributes) => [
            'completed' => false,
        ]);
    }

    public function withDate($date): static
    {
        return $this->state(fn(array $attributes) => [
            'logged_date' => $date,
        ]);
    }

    public function withHabit(Habit $habit): static
    {
        return $this->state(fn(array $attributes) => [
            'habit_id' => $habit->id,
            'user_id' => $habit->user_id,
        ]);
    }

    public function recent(): static
    {
        return $this->state(fn(array $attributes) => [
            'logged_date' => $this->faker->dateTimeBetween('-7 days', 'now'),
        ]);
    }
}
