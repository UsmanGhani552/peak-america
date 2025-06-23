<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\MultiStepForm;
use App\Models\MultiStepForm_1;
use App\Services\FormSteps;
use App\Traits\ResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MultiStepFormController extends Controller
{
    use ResponseTrait;

    private static array $formClasses = [
            '1'   => FormSteps\FormStep1Handler::class,
            '2.1' => FormSteps\FormStep2_1Handler::class,
            '2.2' => FormSteps\FormStep2_2Handler::class,
            '3'   => FormSteps\FormStep3Handler::class,
            '4'   => FormSteps\FormStep4Handler::class,
            '5'   => FormSteps\FormStep5Handler::class,
            '6'   => FormSteps\FormStep6Handler::class,
        ];

    private function getFormClass($step)
    {
        return $this::$formClasses[(string)$step] ?? null;
    }

    private function getController(Request &$request)
    {
        $data = $request->validate([
            'step' => 'required|numeric',
        ]);
        $step = $data['step'];

        $handlerClass = $this->getFormClass($step);
        if($handlerClass){
            return new $handlerClass();
        } else {
            throw new \InvalidArgumentException('No step '.$step.' found.');
        }
    }

    public function submitForm(Request $request)
    {
        try {
            $formController = $this->getController($request);
        } catch (\Throwable $th) {
            return ResponseTrait::error("Fetching form error: ".$th->getMessage(), null, 404);
        }
        return $formController->submit($request);
    }

    public function getForm(Request $request): JsonResponse
    {
        try {
            $formController = $this->getController($request);
            $guest_id = $request->guest_id();
            $data = $formController->get($guest_id, $request->step);
        } catch (\Throwable $th) {
            return ResponseTrait::error("Fetching form error: ".$th->getMessage(), null, 404);
        }

        if (!$data) {
            return ResponseTrait::error("No data found for Form $request->step.", null, 404);
        }
        return ResponseTrait::success("Form $request->step data retrieved successfully.", $data);
    }

    public static function getGuestForms($guest_id)
    {
        $data = [];
        foreach (MultiStepFormController::$formClasses as $step => $class) {
            $form = $class::get($guest_id, $step);
            if($form){
                $data[] = $form;
            }
        }
        return $data;
    }

    public function getAllGuestForms(Request $request): JsonResponse
    {
        $perPage = $request->query('per_page', 15);   // default 15 items per page
        $page    = $request->query('page', 1);
        try {
            // Build a paginated query:
            $relations = self::getRelations();
            $guests = Guest::with($relations)
            ->with('note')
            // ->with('formAssigned')
            ->with('formAssigned.user')
            ->paginate(
                (int) $perPage,    // how many items per page
                ['*'],             // columns
                'page',            // “page” parameter name
                (int) $page        // which page to fetch
            );
            if (!$guests) {
                return ResponseTrait::error("No guests found.", null, 404);
            }
            $guestsData = self::formateForms($guests, $relations);
        } catch (\Throwable $th) {
            return ResponseTrait::error("Invalid pagination parameters: ".$th->getMessage(), null, 400);
        }
        return ResponseTrait::success('Guest forms retrieved successfully.', $guestsData);
    }

    public static function getRelations()
    {
        $relations = [];
        foreach (MultiStepFormController::$formClasses as $step => $class) {
            $relation = $class::TABLE_AND_RELATIONS ?? null;
            if($relation){
                $relations = array_merge($relations, $relation);
            }
        }
        return $relations;
    }

    public static function formateForms($guests, $relations){
        $guestsData = [];
        foreach ($guests as $guest){
            $guestsData[] = self::formateForm($guest, $relations);
        }
        return $guestsData;
    }
    public static function formateForm($guest, $relations)
    {
        if($guest->note == null){
            return $guest;
        }
        $guestData = [
            'id' => $guest->id,
            'uuid' => $guest->uuid,
            'created_at' => $guest->created_at,
            'updated_at' => $guest->updated_at,
            'form_assigned_to' => $guest->formAssigned->pluck('user')->toArray()[0]['name'] ?? null,
        ];
        // Attach note and step to each form attribute
        $forms = [];
        // $staticFormDetails = MultiStepForm::all()->pluck('step', 'id')->toArray();

        // dd($staticFormDetails);
        foreach ($relations as $relation) {
            if (str_contains($relation, '.')) {
                continue;
            }
            $formObj = $guest->$relation == null ? null : (object)['form' => $guest->{$relation}];
            if ($formObj) {
                $stepNumber = self::extractStepFromRelation($relation);
                $note = collect($guest->note)->firstWhere('step', $stepNumber);

                $formObj->note = $note ? $note['note'] : null;
                $formObj->step = $stepNumber;

                foreach ($formObj->form as $form) {
                    if(isset($form->questions) && isset($form->questionAnswers)){
                        foreach ($form->questionAnswers as $questionAnswers) {
                            $questionAnswers->question = $form->questions->firstWhere('id', $questionAnswers->question_id)->question ?? null;
                        }

                        unset($form->questions);
                    }
                }

                if($relation == 'multiStepForm3'){
                    Log::info( json_encode($formObj));
                    foreach ($formObj->form as $form) {
                        if(isset($form['documents'])){
                            if(count($form['documents']) > 0){
                                $formObj->documents = $form['documents'];
                            }
                            unset($form->documents);
                        }
                    }
                }

                $forms[] = $formObj;
            }
        }
        $guestData['forms'] = $forms;
        return $guestData;
    }

    // Helper to extract step number from relation name
    protected static function extractStepFromRelation($relation)
    {
        // Example: multiStepForm1 => 1, multiStepForm2_1 => 2.1, etc.
        if (preg_match('/multiStepForm(\d+)(?:_(\d+))?/', $relation, $matches)) {
            if (isset($matches[2])) {
                return floatval($matches[1] . '.' . $matches[2]);
            }
            return intval($matches[1]);
        }
        return null;
    }
}
