<?php

namespace App\Services\FormSteps;

use App\Models\Kid;
use App\Models\MultiStepForm_4;
use App\Traits\ResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class FormStep4Handler implements FormStepHandlerInterface
{
    use ResponseTrait;

    public function submit(Request $request): JsonResponse
    {
        // Validate and process the request data
        $data = $request->validate([
            'person' => 'required|array|min:1|max:2',
            'person.*.is_spouse' => 'required|boolean',
            'person.*.notes' => 'nullable|string',
            'person.*.properties' => 'nullable|array',
            'person.*.properties.*.type' => 'nullable|string',
            'person.*.properties.*.address' => 'nullable|string',
            'person.*.properties.*.value' => 'nullable|numeric',
        ]);

        try {
            DB::beginTransaction();
            $guest_id = $request->guest_id();

            foreach ($data['person'] as $person) {
                $form = MultiStepForm_4::updateOrCreate([
                    'guest_id' => $guest_id,
                    'is_spouse' => $person['is_spouse'],
                    'notes' => $person['notes'] ?? null,
                ]);

                if ($form->property && $form->property->isNotEmpty()) {
                    $form->property()->delete();
                }

                if (!empty($person['properties']) && is_array($person['properties'])) {
                    foreach ($person['properties'] as $property) {
                        $form->property()->create([
                            'type' => $property['type'] ?? null,
                            'address' => $property['address'] ?? null,
                            'value' => $property['value'] ?? null,
                        ]);
                    }
                }
            }

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            return ResponseTrait::error("Form 4 can't be saved due to {$th->getMessage()}", [], 500);
        }

        return ResponseTrait::success('Form 4 data saved successfully.', $data);
    }

    public function get(Request $request): JsonResponse
    {
        $guest_id = $request->guest_id();
        $from = MultiStepForm_4::where('guest_id', $guest_id)->with('property')->get();

        if ($from->isEmpty()) {
            return ResponseTrait::error('No data found for Form 4.', [], 404);
        }

        return ResponseTrait::success('Form 4 data retrieved successfully.', $from);
    }
}
