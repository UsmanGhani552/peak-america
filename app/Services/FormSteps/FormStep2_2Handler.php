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
                    'step' => 2.2,
                ], [
                    'note' => $data['note']
                ]);
            }

            $total_amounts = 0;
            foreach ($amounts as $index => $amount) {
                $total_amounts += $amount;

                if ($amount !== $data['person'][$index]['total']) {
                    return ResponseTrait::error('Total amounts do not match the number of persons.');
                }
            }
            if ($total_amounts === 0) {
                return ResponseTrait::error('Total amount can\'t be zero.');
            }
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            return ResponseTrait::error("Form 2.2 can't be saved due to {$th->getMessage()}", [], 500);
        }

        return ResponseTrait::success('Form 2.2 data saved successfully.', $data);
    }

    public function get(Request $request): JsonResponse
    {
        $guest_id = $request->guest_id();
        // $from = MultiStepForm_2_2::where('guest_id', $guest_id)->get();
        $from = Guest::where('id', $guest_id)->with('multiStepForm2_2', 'note')->get();

        if ($from->isEmpty()) {
            return ResponseTrait::error('No data found for Form 2.2.', [], 404);
        }

        return ResponseTrait::success('Form 2.2 data retrieved successfully.', $from);
    }
}
