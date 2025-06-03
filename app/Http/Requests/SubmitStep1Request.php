<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubmitStep1Request extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'person' => 'required|array|min:1|max:2',
            'person.*.is_spouse' => 'required|boolean',
            'person.*.first_name' => 'nullable|string|max:255',
            'person.*.last_name' => 'nullable|string|max:255',
            'person.*.age' => 'nullable|integer|min:0',
            'person.*.cell_phone' => 'nullable|string|max:15',
            'person.*.email' => 'nullable|email|max:255',
            'person.*.marital_status' => 'nullable|string|max:50',
            'person.*.kids' => 'nullable|integer',
            'person.*.kids_age' => 'nullable|array',
            'person.*.kids_age.*' => 'integer',
            'person.*.notes' => 'nullable|string',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $persons = $this->input('person', []);

            // Any one cell number
            $hasField = collect($persons)->contains(function ($person) {
                return !empty($person['cell_phone']);
            });
            if (!$hasField) {
                $validator->errors()->add('person', 'At least one person must have a first name.');
            }

            // Any one email
            $hasField = collect($persons)->contains(function ($person) {
                return !empty($person['email']);
            });
            if (!$hasField) {
                $validator->errors()->add('person', 'At least one person must have a email.');
            }

            // Custom marital_status and first_name logic
            $maritalStatusTrue = collect($persons)->contains(function ($person) {
                return isset($person['marital_status']) && $person['marital_status'] === true;
            });

            $isSpouseFalse = collect($persons)->contains(function ($person) {
                return isset($person['is_spouse']) && $person['is_spouse'] === false;
            });

            if ($isSpouseFalse && $maritalStatusTrue) {
                // Both first names required
                foreach ($persons as $index => $person) {
                    if (empty($person['first_name'])) {
                        $validator->errors()->add("person.$index.first_name", 'First name is required for both persons when is_spouse is false and marital_status is true.');
                    }
                    if (empty($person['last_name'])) {
                        $validator->errors()->add("person.$index.last_name", 'Last name is required for both persons when is_spouse is false and marital_status is true.');
                    }
                    if (empty($person['age'])) {
                        $validator->errors()->add("person.$index.age", 'Age is required for both persons when is_spouse is false and marital_status is true.');
                    }
                }
            } else {
                // Only one first name required
                $hasField = collect($persons)->contains(function ($person) {
                    return !empty($person['first_name']);
                });
                if (!$hasField) {
                    $validator->errors()->add('person', 'At least one person must have a first name.');
                }

                // Only one first name required
                $hasField = collect($persons)->contains(function ($person) {
                    return !empty($person['last_name']);
                });
                if (!$hasField) {
                    $validator->errors()->add('person', 'At least one person must have a last name.');
                }

                // Only one first name required
                $hasField = collect($persons)->contains(function ($person) {
                    return !empty($person['age']);
                });
                if (!$hasField) {
                    $validator->errors()->add('person', 'At least one person must have a age.');
                }
            }
        });
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'person.required' => 'The person field is required.',
            'person.array' => 'The person field must be an array.',
            'person.min' => 'At least one person is required.',
            'person.max' => 'A maximum of two persons can be added.',
            'person.*.is_spouse.required' => 'The is_spouse field is required for each person.',
            'person.*.is_spouse.boolean' => 'The is_spouse field must be true or false.',
        ];
    }
}
