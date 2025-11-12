<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PomodoroSessionFactory extends Factory
{
    public function definition(): array
    {
        $startTime = $this->faker->dateTimeBetween('-1 week', 'now');
        $completed = $this->faker->boolean(80);

        return [
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'task_id' => Task::inRandomOrder()->first()->id ?? Task::factory(),
            'start_time' => $startTime,
            'end_time' => $completed ? $this->faker->dateTimeBetween($startTime, '+2 hours') : null,
            'duration_minutes' => $this->faker->numberBetween(15, 60),
            'completed' => $completed,
            'notes' => $this->faker->boolean(40) ? $this->faker->sentence() : null,
        ];
    }

    public function completed(): static
    {
        $startTime = $this->faker->dateTimeBetween('-1 week', 'now');

        return $this->state(fn(array $attributes) => [
            'end_time' => $this->faker->dateTimeBetween($startTime, '+2 hours'),
            'completed' => true,
        ]);
    }

    public function incomplete(): static
    {
        return $this->state(fn(array $attributes) => [
            'end_time' => null,
            'completed' => false,
        ]);
    }

    public function withTask($task): static
    {
        return $this->state(fn(array $attributes) => [
            'task_id' => $task->id,
            'user_id' => $task->assignee_id ?? $task->project->user_id,
        ]);
    }
}
