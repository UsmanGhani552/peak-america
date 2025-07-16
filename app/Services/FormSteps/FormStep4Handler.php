<?php

namespace App\Services\FormSteps;

use App\Models\Guest;
use App\Models\Kid;
use App\Models\MultiStepForm_4;
use App\Models\Note;
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
            'person.*.properties' => 'nullable|array',
            'person.*.properties.*.type' => 'nullable|string',
            'person.*.properties.*.address' => 'nullable|string',
            'person.*.properties.*.value' => 'nullable|numeric',
            'note' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();
            $guest_id = $request->guest_id();

            foreach ($data['person'] as $person) {
                $form = MultiStepForm_4::updateOrCreate([
                    'guest_id' => $guest_id,
                    'is_spouse' => $person['is_spouse'],
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

            if($data['note']){
                Note::updateOrCreate([
                    'guest_id' => $guest_id,
                    'step' => 4,
                ], [
                    'note' => $data['note']
                ]);
            }

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            return ResponseTrait::error("Form 4 can't be saved due to {$th->getMessage()}", null, 500);
        }

        return ResponseTrait::success('Form 4 data saved successfully.', $data);
    }

    public static function get($guest_id, $step)
    {
        $data = Guest::where('id', $guest_id)
            ->with(['multiStepForm4.property'])
            ->first();
        if($data->multiStepForm4->isEmpty()){
            return null;
        }
        $data['note'] = $data->noteForStep($step)->note?? null;
        $data['step'] = (float)$step;
        return $data;
    }

    public const TABLE_AND_RELATIONS = ['multiStepForm4', 'multiStepForm4.property'];
}
