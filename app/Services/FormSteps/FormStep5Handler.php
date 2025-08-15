<?php

namespace App\Services\FormSteps;

use App\Models\Guest;
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
            'question_answers' => 'nullable|array',
            'question_answers.*.answer' => 'nullable|string',
            'note' => 'nullable|string',
        ]);
        $step = $request['step'];
        try {
            DB::beginTransaction();
            $guest_id = $request->guest_id();

            $form = MultiStepForm_5::updateOrCreate([
                    'guest_id' => $guest_id,
                    'is_spouse' => false,
                ]);

            // Save Question Answers
            if (!empty($data['question_answers']) && is_array($data['question_answers'])) {
                $multiStepForm = MultiStepForm::where('step', $step)->with('questions')->first();
                $questions_id = $multiStepForm && $multiStepForm->questions ? $multiStepForm->questions->pluck('id')->all() : [];

                if (count($data['question_answers']) != count($questions_id)){
                    $questionOffset = count($questions_id)-count($data['question_answers']);
                    $message = '';
                    if ($questionOffset > 0) {
                        $message = 'You have '.$questionOffset.' question(s) remaining.';
                    } else {
                        $message = 'You have answered extra '.abs($questionOffset).' questions.';
                    }
                    return ResponseTrait::error($message, null, 422);
                }

                $form->questionAnswers()->delete();
                foreach ($data['question_answers'] as $index => $qa) {

                    $form->questionAnswers()->create([
                        'question_id' => $questions_id[$index],
                        'answer' => $qa['answer'],
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
            return ResponseTrait::error("Form {$step} can't be saved due to {$th->getMessage()}", null, 500);
        }

        return ResponseTrait::success("Form {$step} data saved successfully.", $data);
    }

    public static function get($guest_id, $step)
    {
        $data = Guest::where('id', $guest_id)
            ->with(['multiStepForm5.questionAnswers'])
            ->first();
        if($data->multiStepForm5->isEmpty()){
            return null;
        }
        $data['note'] = $data->noteForStep(1)->note?? null;
        $data['step'] = (float)$step;
        return $data;
    }

    public const TABLE_AND_RELATIONS = ['multiStepForm5', 'multiStepForm5.questionAnswers', 'multiStepForm5.questions'];
}
