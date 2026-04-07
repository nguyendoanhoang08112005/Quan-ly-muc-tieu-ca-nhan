<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateGoalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'min:3', 'max:180'],
            'description' => ['sometimes', 'required', 'string', 'min:10'],
            'goal_type' => ['sometimes', 'required', 'in:short_term,mid_term,long_term'],
            'priority' => ['sometimes', 'required', 'in:low,medium,high,critical'],
            'status' => ['sometimes', 'required', 'in:not_started,in_progress,completed,paused,cancelled'],
            'start_date' => ['sometimes', 'required', 'date'],
            'target_date' => ['sometimes', 'required', 'date'],
            'note' => ['sometimes', 'nullable', 'string'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $startDate = $this->input('start_date', $this->route('goal')?->start_date?->toDateString());
            $targetDate = $this->input('target_date', $this->route('goal')?->target_date?->toDateString());

            if ($startDate && $targetDate && strtotime($targetDate) < strtotime($startDate)) {
                $validator->errors()->add('target_date', 'Ngay ket thuc phai lon hon hoac bang ngay bat dau.');
            }
        });
    }
}
