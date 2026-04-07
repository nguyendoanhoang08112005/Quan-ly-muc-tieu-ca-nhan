<?php

namespace Database\Factories;

use App\Models\User;
use Faker\Factory as FakerFactory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class GoalFactory extends Factory
{
    public function definition(): array
    {
        $faker = FakerFactory::create();
        $startDate = $faker->dateTimeBetween('-2 weeks', '+2 weeks');
        $targetDate = $faker->dateTimeBetween($startDate, '+4 months');
        $status = $faker->randomElement(['not_started', 'in_progress', 'completed', 'paused']);
        $progress = match ($status) {
            'completed' => 100,
            'in_progress' => $faker->numberBetween(10, 90),
            default => 0,
        };
        $title = $faker->sentence(4);

        return [
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'category_id' => null,
            'title' => $title,
            'slug' => Str::slug($title),
            'description' => $faker->paragraph(3),
            'goal_type' => $faker->randomElement(['short_term', 'mid_term', 'long_term']),
            'priority' => $faker->randomElement(['low', 'medium', 'high', 'critical']),
            'status' => $status,
            'progress_percentage' => $progress,
            'start_date' => $startDate,
            'target_date' => $targetDate,
            'completed_at' => $status === 'completed' ? $targetDate : null,
            'success_metric' => $faker->sentence(),
            'outcome_note' => $status === 'completed' ? $faker->paragraph() : null,
            'note' => $faker->boolean(40) ? $faker->paragraph() : null,
            'is_archived' => false,
            'is_recurring' => false,
            'recurrence_rule' => null,
            'sort_order' => $faker->numberBetween(0, 20),
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'in_progress',
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'progress_percentage' => 100,
            'completed_at' => now(),
        ]);
    }

    public function withUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }
}
