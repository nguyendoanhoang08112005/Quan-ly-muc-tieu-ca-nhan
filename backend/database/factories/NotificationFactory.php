<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationFactory extends Factory
{
    public function definition(): array
    {
        $related = $this->faker->randomElement([
            \App\Models\Task::factory()->create(),
            \App\Models\Goal::factory()->create(),
        ]);

        return [
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'type' => $this->faker->randomElement([
                'task_assigned', 
                'deadline_reminder', 
                'goal_completed',
                'task_overdue'
            ]),
            'title' => $this->faker->sentence(),
            'message' => $this->faker->paragraph(),
            'related_type' => get_class($related),
            'related_id' => $related->id,
            'is_read' => $this->faker->boolean(30),
            'read_at' => $this->faker->optional(0.3)->dateTimeThisMonth(),
        ];
    }

    public function unread(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_read' => false,
            'read_at' => null,
        ]);
    }

    public function read(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_read' => true,
            'read_at' => now(),
        ]);
    }

    public function taskAssigned(): static
    {
        $task = \App\Models\Task::factory()->create();
        
        return $this->state(fn (array $attributes) => [
            'type' => 'task_assigned',
            'related_type' => \App\Models\Task::class,
            'related_id' => $task->id,
        ]);
    }
}