<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function assignFormToUser(Request $request, FormAssignmentController $formAssignmentController): \Illuminate\View\View
    {
        // Fetch assigned forms for the user
        $response = $formAssignmentController->assignFormToUser($request);

        // Assign the forms to the view
        return view('dashboard.assign-form-to-user', ['response' => $response]);
    }

    public function getAssignedForms(Request $request, FormAssignmentController $formAssignmentController, MultiStepFormController $multiStepFormController): \Illuminate\View\View
    {
        // Fetch assigned forms for the user
        $response = $formAssignmentController->getAssignedForms($request, $multiStepFormController);

        // Assign the forms to the view
        return view('dashboard.get-assigned-forms', ['response' => $response]);
    }

    public function getAllUnassignedGuestForms(Request $request, FormAssignmentController $formAssignmentController): \Illuminate\View\View
    {
        // Fetch assigned forms for the user
        $response = $formAssignmentController->getAllUnassignedGuestForms($request);

        // Assign the forms to the view
        return view('dashboard.get-all-unassigned-guest-forms', ['response' => $response]);
    }
}
