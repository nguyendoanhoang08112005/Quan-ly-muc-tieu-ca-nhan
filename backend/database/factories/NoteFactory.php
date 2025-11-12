<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class NoteFactory extends Factory
{
    public function definition(): array
    {
        $noteable = $this->faker->randomElement([
            \App\Models\Task::factory()->create(),
            \App\Models\Goal::factory()->create(),
        ]);

        return [
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'noteable_type' => get_class($noteable),
            'noteable_id' => $noteable->id,
            'content' => $this->faker->paragraph(3),
        ];
    }

    public function forTask($task = null): static
    {
        return $this->state(fn (array $attributes) => [
            'noteable_type' => \App\Models\Task::class,
            'noteable_id' => $task ? $task->id : \App\Models\Task::factory()->create()->id,
        ]);
    }

    public function forGoal($goal = null): static
    {
        return $this->state(fn (array $attributes) => [
            'noteable_type' => \App\Models\Goal::class,
            'noteable_id' => $goal ? $goal->id : \App\Models\Goal::factory()->create()->id,
        ]);
    }
}