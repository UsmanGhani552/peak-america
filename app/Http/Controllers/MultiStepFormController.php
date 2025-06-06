<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Services\FormSteps;
use App\Traits\ResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MultiStepFormController extends Controller
{
    use ResponseTrait;

    private array $formClasses = [
            '1'   => FormSteps\FormStep1Handler::class,
            '2.1' => FormSteps\FormStep2_1Handler::class,
            '2.2' => FormSteps\FormStep2_2Handler::class,
            '4'   => FormSteps\FormStep4Handler::class,
            '5'   => FormSteps\FormStep5Handler::class,
            '6'   => FormSteps\FormStep6Handler::class,
        ];

    private function getFormClass($step)
    {
        return $this->formClasses[(string)$step] ?? null;
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

    public function getGuestForms($guest_id)
    {
        $data = [];
        foreach ($this->formClasses as $step => $class) {
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
            $guests = Guest::paginate(
                (int) $perPage,    // how many items per page
                ['*'],             // columns
                'page',            // “page” parameter name
                (int) $page        // which page to fetch
            );

            foreach ($guests as $guest) {
                $guest->forms = $this->getGuestForms($guest->id);
            }
        } catch (\Throwable $th) {
            return ResponseTrait::error("Invalid pagination parameters: ".$th->getMessage(), null, 400);
        }
        return ResponseTrait::success('Guest forms retrieved successfully.', $guests);
    }
}
