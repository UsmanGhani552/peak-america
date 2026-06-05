<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\MultiStepFormController;
use App\Models\FormAssignment;
use App\Models\Guest;
use App\Traits\ResponseTrait;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

use function Laravel\Prompts\select;

class FormController extends Controller
{
    public function index(Request $request)
    {
        try {
            $formRelationNames = MultiStepFormController::getFormNames();
            $assignedGuestIds = FormAssignment::pluck('guest_id')->toArray();
            $guestsData = Guest::whereNotIn('id', $assignedGuestIds)->with('multiStepForm1')->get()->filter(function ($element) use ($formRelationNames) {
                foreach ($formRelationNames as $name) {
                    if (count($element[$name]) == 0){
                        return false;
                    }
                }
                return true;
            })
            ->values();;
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
            $formRelationNames = MultiStepFormController::getFormNames();
            $guestsData = Guest::with('formAssigned.user', 'multiStepForm1')->get()
            ->filter(function ($element) use ($formRelationNames) {
                foreach ($formRelationNames as $name) {
                    if (count($element[$name]) == 0){
                        return false;
                    }
                }
                return true;
            })
            ->values();
            if (!$guestsData) {
                return ResponseTrait::error("No guests found.", null, 404);
            }
        } catch (\Throwable $th) {
            return ResponseTrait::error('Form assignments failed due to: ' . $th->getMessage(), null, 422);
        }
        return view('admin.all-forms.index', ['guestsData' => $guestsData]);
    }

    public function delete($id)
    {
        try {
            $guest = Guest::findOrFail($id);
            $guest->multiStepForm1()->delete();
            $guest->multiStepForm2_1()->delete();
            $guest->multiStepForm2_2()->delete();
            $guest->multiStepForm3()->delete();
            $guest->multiStepForm4()->delete();
            $guest->multiStepForm5()->delete();
            $guest->multiStepForm6()->delete();
            $guest->note()->delete();
            $guest->formAssigned()->delete();
            $guest->delete();
            return redirect()->back()->with('success', 'Form deleted successfully.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Failed to delete form: ' . $th->getMessage());
        }
    }

    public function downloadPdf($id)
    {
        try {
            $relations = MultiStepFormController::getRelations();
            $guest = Guest::with($relations)
                ->with('note')
                ->findOrFail($id);
            $formData = MultiStepFormController::formateForm($guest, $relations);

            $pdf = Pdf::loadView('admin.pdf.form', compact('formData'))
                ->setPaper('a4', 'portrait');

            return $pdf->download('form-' . ($formData['uuid'] ?? $id) . '.pdf');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Failed to generate PDF: ' . $th->getMessage());
        }
    }

}
