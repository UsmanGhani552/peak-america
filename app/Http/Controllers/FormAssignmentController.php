<?php

namespace App\Http\Controllers;

use App\Models\FormAssignment;
use App\Models\Guest;
use App\Traits\ResponseTrait;
use Illuminate\Http\Request;

class FormAssignmentController extends Controller
{
    use ResponseTrait;

    public function assignFormToUser(Request $request)
    {
        $user_id = $request->user()->id;
        $data = $request->validate([
            'guest_id' => 'required|exists:guests,id',
        ]);

        try {
            $guest_id = $data['guest_id'];
            $formAssignment = FormAssignment::where('guest_id', $guest_id)
                ->where('user_id', $user_id)->get();
            if($formAssignment){
                return ResponseTrait::error('Form already assigned to this user', null, 400);
            }
            $formAssignment = FormAssignment::create([
                'guest_id' => $guest_id,
                'user_id' => $user_id,
            ]);
        } catch (\Throwable $th) {
            return ResponseTrait::error('Form assignment failed: ' . $th->getMessage(), null, 500);
        }
        return ResponseTrait::success('Form assigned successfully', $formAssignment, 201);
    }

    public function getAssignedForms(Request $request, MultiStepFormController $multiStepFormController)
    {
        try {
            $formAssigned = FormAssignment::where('user_id', $request->user()->id)->get();
            foreach ($formAssigned as $assignment) {
                $assignment->form_data = $multiStepFormController->getGuestForms($assignment->guest_id);
            }
        } catch (\Throwable $th) {
            return ResponseTrait::error('Form assignments failed due to: ' . $th->getMessage(), null, 422);
        }
        return ResponseTrait::success('Form assignments retrieved successfully', $formAssigned);
    }
}
