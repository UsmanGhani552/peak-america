<?php

namespace App\Services\FormSteps;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

interface FormStepHandlerInterface
{
    public function submit(Request $request): JsonResponse;
    public function get(Request $request): JsonResponse;
}
