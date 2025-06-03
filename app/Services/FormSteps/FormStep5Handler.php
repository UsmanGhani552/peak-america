<?php

namespace App\Services\FormSteps;

use App\Models\MultiStepForm;
use App\Models\Kid;
use App\Models\MultiStepForm_5;
use App\Models\Note;
use App\Models\QuestionAnswer;
use App\Traits\ResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class FormStep5Handler implements FormStepHandlerInterface
{
    use ResponseTrait;

    public function submit(Request $request): JsonResponse
    {
        // Validate and process the request data
        $data = $request->validate([
            'person' => 'required|array|min:1|max:2',
            'person.*.is_spouse' => 'required|boolean',
            'person.*.question_answers' => 'nullable|array',
            'person.*.question_answers.*.answer' => 'nullable|string',
            'note' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();
            $guest_id = $request->guest_id();

            foreach ($data['person'] as $person) {
                $form = MultiStepForm_5::updateOrCreate([
                        'guest_id' => $guest_id,
                        'is_spouse' => $person['is_spouse'],
                    ]);

                if ($form->property && $form->property->isNotEmpty()) {
                    $form->property()->delete();
                }

                // Save Question Answers
                if (!empty($person['question_answers']) && is_array($person['question_answers'])) {
                    $multiStepForm = MultiStepForm::where('step', $data['step'] ?? 5)->with('questions')->first();
                    $questions_id = $multiStepForm && $multiStepForm->questions ? $multiStepForm->questions->pluck('id')->all() : [];

                    if (count($person['question_answers']) != count($questions_id)){
                        return ResponseTrait::error(($person['is_spouse'] ? 'Spouse ' : 'You ')  . 'did not answer all questions. '.(count($questions_id)-count($person['question_answers'])). ' Question remaing', [], 422);
                    }

                    $form->questionAnswers()->delete();
                    foreach ($person['question_answers'] as $index => $qa) {

                        $form->questionAnswers()->create([
                            'question_id' => $questions_id[$index],
                            'answer' => $qa['answer'],
                        ]);
                    }
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
            return ResponseTrait::error("Form 5 can't be saved due to {$th->getMessage()}", [], 500);
        }

        return ResponseTrait::success('Form 5 data saved successfully.', $data);
    }

    public function get(Request $request): JsonResponse
    {
        $guest_id = $request->guest_id();
        $from = MultiStepForm_5::where('guest_id', $guest_id)->with('questionAnswers')->get();

        if ($from->isEmpty()) {
            return ResponseTrait::error('No data found for Form 5.', [], 404);
        }

        return ResponseTrait::success('Form 5 data retrieved successfully.', $from);
    }
}
