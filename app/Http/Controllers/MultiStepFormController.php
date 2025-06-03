<?php

namespace App\Http\Controllers;

use App\Services\FormSteps;
use App\Traits\ResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MultiStepFormController extends Controller
{
    use ResponseTrait;

    private function getController(Request &$request)
    {
        $data = $request->validate([
            'step' => 'required|numeric',
        ]);
        $step = $data['step'];
        return match ($step) {
            1 => new FormSteps\FormStep1Handler(),
            2.1 => new FormSteps\FormStep2_1Handler(),
            2.2 => new FormSteps\FormStep2_2Handler(),
            4 => new FormSteps\FormStep4Handler(),
            5 => new FormSteps\FormStep5Handler(),
            6 => new FormSteps\FormStep6Handler(),
            default => throw new \InvalidArgumentException('No step '.$step.' found.'),
        };
    }

    public function submitForm(Request $request)
    {
        $formController = $this->getController($request);
        return $formController->submit($request);
    }

    public function getForm(Request $request)
    {
        $formController = $this->getController($request);
        return $formController->get($request);
    }
}
