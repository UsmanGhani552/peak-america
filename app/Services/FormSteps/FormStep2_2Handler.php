<?php

namespace App\Services\FormSteps;

use App\Models\Guest;
use App\Models\Kid;
use App\Models\MultiStepForm_2_2;
use App\Models\Note;
use App\Traits\ResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class FormStep2_2Handler implements FormStepHandlerInterface
{
    use ResponseTrait;

    public function submit(Request $request): JsonResponse
    {
        // Validate and process the request data
        $data = $request->validate([
            'person' => 'required|array|min:1|max:2',
            'person.*.is_spouse' => 'required|boolean',

            'person.*.annuities' => 'nullable|numeric',
            'person.*.lump_sum_pension' => 'nullable|numeric',
            'person.*.long_term_care_insurance' => 'nullable|numeric',
            'person.*.life_insurance' => 'nullable|numeric',
            'person.*.business_interest' => 'nullable|numeric',
            'person.*.other_assets' => 'nullable|numeric',
            'person.*.total' => 'numeric',
            'note' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();
            $guest_id = $request->guest_id();
            $personsInDB = [];
            $amounts = [];
            foreach ($data['person'] as $person) {
                $amount =
                    ($person['annuities'] ?? 0) +
                    ($person['lump_sum_pension'] ?? 0) +
                    ($person['long_term_care_insurance'] ?? 0) +
                    ($person['life_insurance'] ?? 0) +
                    ($person['business_interest'] ?? 0) +
                    ($person['other_assets'] ?? 0);

                $amounts[] = $amount;

                $personsInDB[] = MultiStepForm_2_2::updateOrCreate([
                    'guest_id' => $guest_id,
                    'is_spouse' => $person['is_spouse'],
                ], [
                    'annuities' => $person['annuities'] ?? null,
                    'lump_sum_pension' => $person['lump_sum_pension'] ?? null,
                    'long_term_care_insurance' => $person['long_term_care_insurance'] ?? null,
                    'life_insurance' => $person['life_insurance'] ?? null,
                    'business_interest' => $person['business_interest'] ?? null,
                    'other_assets' => $person['other_assets'] ?? null,
                    'total' => $person['total'] ?? null,
                ]);
            }

            if($data['note']){
                Note::updateOrCreate([
                    'guest_id' => $guest_id,
                    'step' => 1,
                ], [
                    'note' => $data['note']
                ]);
            }

            $total_amounts = 0;
            foreach ($amounts as $index => $amount) {
                $total_amounts += $amount;

                if ($amount !== $data['person'][$index]['total']) {
                    return ResponseTrait::error('Total amounts do not match the number of persons. Its off by ' . abs($amount - $data['person'][$index]['total']));
                }
            }
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            return ResponseTrait::error("Form 2.2 can't be saved due to {$th->getMessage()}", null, 500);
        }

        return ResponseTrait::success('Form 2.2 data saved successfully.', $data);
    }

    public static function get($guest_id, $step)
    {
        $data = Guest::where('id', $guest_id)
            ->with(['multiStepForm2_2'])
            ->first();
        if($data->multiStepForm2_2->isEmpty()){
            return null;
        }
        $data['note'] = $data->noteForStep(1)->note?? null;
        $data['step'] = (float)$step;
        return $data;
    }

    public const TABLE_AND_RELATIONS = ['multiStepForm2_2'];
}
