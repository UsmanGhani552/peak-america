<?php

namespace App\Http\Controllers;

use App\Models\FormAssignment;
use App\Models\Guest;
use App\Traits\ResponseTrait;
use Illuminate\Http\Request;

class FormAssignmentController extends Controller
{
    use ResponseTrait;

    public function index() {
        try {
            $relations = MultiStepFormController::getRelations();
            $assignedGuestIds = FormAssignment::where('user_id', auth()->user()->id)
            ->pluck('guest_id')
            ->toArray();

            // Get guests with those IDs and eager load relations
            $guests = Guest::with($relations)
                ->with('note')
                ->whereIn('id', $assignedGuestIds)
                ->get();

            if (!$guests) {
                return ResponseTrait::error("No guests found.", null, 404);
            }
            $guestsData = MultiStepFormController::formateForms($guests, $relations);
        } catch (\Throwable $th) {
            return ResponseTrait::error('Form assignments failed due to: ' . $th->getMessage(), null, 422);
        }
        return view('admin.my-forms.index', ['guestsData' => $guestsData]);
    }
    public function assignFormToUser(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'form_id' => 'required|exists:guests,id',
        ]);

        try {
            $user_id = $data['user_id'];
            $guest_id = $data['form_id'];
            $formAssignment = FormAssignment::where('guest_id', $guest_id)
                ->where('user_id', $user_id)->get()->first();
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
            $relations = MultiStepFormController::getRelations();
            $assignedGuestIds = FormAssignment::where('user_id', $request->user()->id)
            ->pluck('guest_id')
            ->toArray();

            // Get guests with those IDs and eager load relations
            $guests = Guest::with($relations)
                ->with('note')
                ->whereIn('id', $assignedGuestIds)
                ->get();

            if (!$guests) {
                return ResponseTrait::error("No guests found.", null, 404);
            }
            $formAssigned = MultiStepFormController::formateForms($guests, $relations);
        } catch (\Throwable $th) {
            return ResponseTrait::error('Form assignments failed due to: ' . $th->getMessage(), null, 422);
        }
        return ResponseTrait::success('Form assignments retrieved successfully', $formAssigned);
    }

    public function getAllUnassignedGuestForms(Request $request)
    {
        $perPage = $request->query('per_page', 15);   // default 15 items per page
        $page    = $request->query('page', 1);
        try {
            $assignedGuestIds = FormAssignment::pluck('guest_id')->toArray();
            // Build a paginated query:
            $relations = MultiStepFormController::getRelations();
            $guests = Guest::whereNotIn('id', $assignedGuestIds)
            ->with($relations)
            ->with('note')
            ->paginate(
                (int) $perPage,    // how many items per page
                ['*'],             // columns
                'page',            // “page” parameter name
                (int) $page        // which page to fetch
            );
            if (!$guests) {
                return ResponseTrait::error("No guests found.", null, 404);
            }
            $guestsData = MultiStepFormController::formateForms($guests, $relations);
        } catch (\Throwable $th) {
            return ResponseTrait::error("Invalid pagination parameters: ".$th->getMessage(), null, 400);
        }
        return ResponseTrait::success('Guest forms retrieved successfully.', $guestsData);
    }
}
