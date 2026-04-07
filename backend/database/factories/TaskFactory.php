<?php

namespace Database\Factories;

use App\Models\Goal;
use Faker\Factory as FakerFactory;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    public function definition(): array
    {
        $faker = FakerFactory::create();
        $goal = Goal::query()->inRandomOrder()->first() ?? Goal::factory()->create();
        $status = $faker->randomElement(['not_started', 'in_progress', 'completed', 'paused']);
        $dueAt = $faker->dateTimeBetween('now', '+1 month');
        $startedAt = $status !== 'not_started' ? $faker->dateTimeBetween('-1 week', 'now') : null;
        $completedAt = $status === 'completed' ? $faker->dateTimeBetween($startedAt ?? '-2 days', 'now') : null;
        $progress = match ($status) {
            'completed' => 100,
            'in_progress' => $faker->numberBetween(20, 90),
            default => 0,
        };

        return [
            'user_id' => $goal->user_id,
            'goal_id' => $goal->id,
            'title' => $faker->sentence(4),
            'description' => $faker->paragraph(2),
            'status' => $status,
            'priority' => $faker->randomElement(['low', 'medium', 'high', 'critical']),
            'progress_percentage' => $progress,
            'due_at' => $dueAt,
            'started_at' => $startedAt,
            'completed_at' => $completedAt,
            'estimated_minutes' => $faker->numberBetween(30, 600),
            'actual_minutes' => $completedAt ? $faker->numberBetween(20, 720) : null,
            'is_focus' => $faker->boolean(20),
            'sort_order' => $faker->numberBetween(0, 100),
            'metadata' => null,
        ];
    }

    public function todo(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'not_started',
            'progress_percentage' => 0,
            'started_at' => null,
            'completed_at' => null,
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
            'status' => 'completed',
            'progress_percentage' => 100,
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
            'due_at' => FakerFactory::create()->dateTimeBetween('-1 month', '-1 day'),
            'status' => FakerFactory::create()->randomElement(['not_started', 'in_progress']),
        ]);
    }
}
