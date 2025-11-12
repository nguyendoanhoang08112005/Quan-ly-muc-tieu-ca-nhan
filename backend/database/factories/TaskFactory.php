<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\Goal;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    public function definition(): array
    {
        $dueDate = $this->faker->dateTimeBetween('now', '+1 month');

        return [
            'assignee_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'project_id' => Project::inRandomOrder()->first()->id ?? Project::factory(),
            'goal_id' => Goal::inRandomOrder()->first()->id ?? Goal::factory(),
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph(2),
            'status' => $this->faker->randomElement(['todo', 'in_progress', 'review', 'done']),
            'priority' => $this->faker->randomElement(['low', 'medium', 'high', 'urgent']),
            'due_date' => $dueDate,
            'estimated_hours' => $this->faker->randomFloat(2, 1, 20),
            'actual_hours' => $this->faker->randomFloat(2, 0, 25),
            'order' => $this->faker->numberBetween(0, 100),
        ];
    }

    public function todo(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'todo',
        ]);
    }

    public function inProgress(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'in_progress',
        ]);
    }

    public function done(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'done',
            'completed_at' => now(),
        ]);
    }

    public function highPriority(): static
    {
        return $this->state(fn(array $attributes) => [
            'priority' => 'high',
        ]);
    }

    public function overdue(): static
    {
        return $this->state(fn(array $attributes) => [
            'due_date' => $this->faker->dateTimeBetween('-1 month', '-1 day'),
            'status' => $this->faker->randomElement(['todo', 'in_progress']),
        ]);
    }
}
