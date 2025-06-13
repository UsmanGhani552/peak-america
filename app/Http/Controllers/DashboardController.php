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
        return view('admin.all-forms.index', ['response' => $response])->with('success', 'Form assigned successfully');
    }

    public function getAssignedForms(Request $request, FormAssignmentController $formAssignmentController, MultiStepFormController $multiStepFormController): \Illuminate\View\View
    {
        // Fetch assigned forms for the user
        $response = $formAssignmentController->getAssignedForms($request, $multiStepFormController);

        // Assign the forms to the view
        return view('admin.all-forms.index', ['response' => $response]);
    }

    public function getAllUnassignedGuestForms(Request $request, FormAssignmentController $formAssignmentController): \Illuminate\View\View
    {
        // Fetch assigned forms for the user
        $response = $formAssignmentController->getAllUnassignedGuestForms($request);

        // Assign the forms to the view
        return view('dashboard.get-all-unassigned-guest-forms', ['response' => $response]);
    }
}
