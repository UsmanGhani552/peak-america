<?php

namespace App\Services\FormSteps;

use App\Http\Requests\SubmitStep1Request;
use App\Models\Guest;
use App\Models\Kid;
use App\Models\MultiStepForm_1;
use App\Models\Note;
use App\Traits\ResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class FormStep1Handler implements FormStepHandlerInterface
{
    use ResponseTrait;

    // public function submit(SubmitStep1Request $request): JsonResponse
    public function submit(Request $request): JsonResponse
    {
        $validator = SubmitStep1Request::customValidator($request);
        if ($validator->fails()) {
            return ResponseTrait::validationError(error:$validator->errors());
        }
        $data = $validator->validated();

        try {
            DB::beginTransaction();
            $guest_id = $request->guest_id();
            foreach ($data['person'] as $person) {
                $personsInDB = MultiStepForm_1::updateOrCreate([
                    'guest_id' => $guest_id,
                    'is_spouse' => $person['is_spouse'],
                ], [
                    'first_name' => $person['first_name'],
                    'last_name' => $person['last_name'],
                    'age' => $person['age'],
                    'cell_phone' => $person['cell_phone'],
                    'email' => $person['email'],
                    'marital_status' => $person['marital_status']
                ]);

                if ($personsInDB->kids && $personsInDB->kids->isNotEmpty()) {
                    $personsInDB->kids()->delete();
                }

                foreach ($person['kids_age'] as $kids_age) {
                    Kid::create([
                        'age' => $kids_age,
                        'multi_step_form_1_id' => $personsInDB->id,
                    ]);
                }
            }

            if($data['note']){
                Note::updateOrCreate([
                    'guest_id' => $guest_id,
                    'step' => 1,
                ], [
                    'note' => $data['note']
                ]);
            }

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            return ResponseTrait::error("Form 1 can't be saved due to {$th->getMessage()}", [], 500);
        }

        return ResponseTrait::success('Form 1 data saved successfully.', $data);
    }

    public function get(Request $request): JsonResponse
    {
        $guest_id = $request->guest_id();
        // $from = MultiStepForm_1::where('guest_id', $guest_id)->with('kids')->get();
        $from = Guest::where('id', $guest_id)->with('multiStepForm1', 'multiStepForm1.kids', 'note')->get();
        // $from = Guest::where('id', $guest_id)
        // ->with([
        //     'multiStepForm1.kids',
        //     // 'note'
        // ])
        // ->first();

        if ($from->isEmpty()) {
            return ResponseTrait::error('No data found for Form 1.', [], 404);
        }

        return ResponseTrait::success('Form 1 data retrieved successfully.', $from);
    }
}
