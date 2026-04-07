<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGoalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:3', 'max:180'],
            'description' => ['required', 'string', 'min:10'],
            'goal_type' => ['required', 'in:short_term,mid_term,long_term'],
            'priority' => ['required', 'in:low,medium,high,critical'],
            'status' => ['required', 'in:not_started,in_progress,completed,paused,cancelled'],
            'start_date' => ['required', 'date'],
            'target_date' => ['required', 'date', 'after_or_equal:start_date'],
            'note' => ['nullable', 'string'],
        ];
    }
}
