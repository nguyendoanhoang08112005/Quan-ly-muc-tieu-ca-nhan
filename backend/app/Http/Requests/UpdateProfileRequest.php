<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'min:2', 'max:255'],
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($this->user()?->id),
            ],
            'timezone' => ['sometimes', 'required', 'string', 'max:64'],
            'locale' => ['sometimes', 'required', 'string', 'in:vi,en'],
            'avatar_path' => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }
}
