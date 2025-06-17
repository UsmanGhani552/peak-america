<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\MultiStepFormController;
use App\Models\FormAssignment;
use App\Models\Guest;
use App\Traits\ResponseTrait;
use Illuminate\Http\Request;

use function Laravel\Prompts\select;

class FormController extends Controller
{
    public function index(Request $request)
    {
        try {
            $assignedGuestIds = FormAssignment::pluck('guest_id')->toArray();
            $guestsData = Guest::whereNotIn('id', $assignedGuestIds)->select('id','uuid')->get();
            if (!$guestsData) {
                return ResponseTrait::error("No guests found.", null, 404);
            }
            return view('admin.unassigned-forms.index', compact('guestsData'));
        } catch (\Throwable $th) {
            return ResponseTrait::error("Invalid pagination parameters: " . $th->getMessage(), null, 400);
        }
    }

    public function show($id)
    {
        try {
            $relations = MultiStepFormController::getRelations();
            $guest = Guest::with($relations)
                ->with('note')
                ->findOrFail($id);
            $formData = MultiStepFormController::formateForm($guest, $relations);

            return ResponseTrait::success("Form data retrieved successfully.", $formData);
        } catch (\Throwable $th) {
            return ResponseTrait::error("Form not found: " . $th->getMessage(), null, 404);
        }
    }

    public function assignFormToUser($guest_id)
    {

        try {
            $user_id = auth()->user()->id;
            $formAssignment = FormAssignment::where('guest_id', $guest_id)
                ->where('user_id', $user_id)->get()->first();
            if ($formAssignment) {
                return ResponseTrait::error('Form already assigned to this user', null, 400);
            }
            $formAssignment = FormAssignment::create([
                'guest_id' => $guest_id,
                'user_id' => $user_id,
            ]);
        } catch (\Throwable $th) {
            return ResponseTrait::error('Form assignment failed: ' . $th->getMessage(), null, 500);
        }
        return redirect()->route('admin.unassigned-form.index')->with('success', 'Form accepted successfully! Check My Forms to view it.');
    }

    public function allForms() {
        try {
            $guestsData = Guest::with('formAssigned.user')->get();
            if (!$guestsData) {
                return ResponseTrait::error("No guests found.", null, 404);
            }
        } catch (\Throwable $th) {
            return ResponseTrait::error('Form assignments failed due to: ' . $th->getMessage(), null, 422);
        }
        return view('admin.all-forms.index', ['guestsData' => $guestsData]);
    }

}
