<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\MultiStepFormController;
use App\Models\FormAssignment;
use App\Models\Guest;
use App\Traits\ResponseTrait;
use Illuminate\Http\Request;

class FormController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 15);   // default 15 items per page
        $page  = $request->query('page', 1);
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
            return view('admin.all-forms.index', compact('guestsData'));
        } catch (\Throwable $th) {
            return ResponseTrait::error("Invalid pagination parameters: " . $th->getMessage(), null, 400);
        }
    }

    public function show($id)
    {
        try {
            $guest = Guest::with(MultiStepFormController::getRelations())
                ->with('note')
                ->findOrFail($id);
            $formData = MultiStepFormController::formateForm($guest, MultiStepFormController::getRelations());

            return response()->json([
                'status' => 'success',
                'message' => 'Form data retrieved successfully.',
                'data' => $formData
            ]);
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
        return redirect()->route('admin.form.index')->with('success', 'Form accepted successfully! Check My Forms to view it.');
    }
    
}
