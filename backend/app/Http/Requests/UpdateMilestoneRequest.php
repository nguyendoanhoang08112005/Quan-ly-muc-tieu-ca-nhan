<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateMilestoneRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:180'],
            'description' => ['sometimes', 'nullable', 'string'],
            'status' => ['sometimes', 'required', 'in:not_started,in_progress,completed,paused'],
            'start_date' => ['sometimes', 'nullable', 'date'],
            'target_date' => ['sometimes', 'nullable', 'date'],
            'note' => ['sometimes', 'nullable', 'string'],
            'sequence_no' => ['sometimes', 'nullable', 'integer', 'min:1'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $milestone = $this->route('milestone');
            $startDate = $this->input('start_date', $milestone?->start_date?->toDateString());
            $targetDate = $this->input('target_date', $milestone?->target_date?->toDateString());

            if ($startDate && $targetDate && strtotime($targetDate) < strtotime($startDate)) {
                $validator->errors()->add('target_date', 'Ngay muc tieu phai lon hon hoac bang ngay bat dau.');
            }
        });
    }
}
