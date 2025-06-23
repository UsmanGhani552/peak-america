<?php

namespace App\Services\FormSteps;

use App\Enums\ExpenseType;
use App\Helpers\FileManager;
use App\Models\Document;
use App\Models\Expense;
use App\Models\ExpenseDetail;
use App\Models\Guest;
use App\Models\MultiStepForm_3;
use App\Models\Note;
use App\Traits\ResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class FormStep3Handler implements FormStepHandlerInterface
{
    use ResponseTrait;

    public function submit(Request $request): JsonResponse
    {
        $data = $request->validate([
            'person' => 'required|array|min:1|max:2',
            'person.*.is_spouse' => 'required|boolean',
            'person.*.expenses' => 'nullable|array',

            'person.*.expenses.*.label' => ['required', Rule::in(array_column(ExpenseType::cases(), 'value'))],
            'person.*.expenses.*.total' => 'required|numeric',
            'person.*.expenses.*.estimated_annual_amount' => 'nullable|numeric',
            'person.*.expenses.*.details' => 'nullable|array',
            'person.*.expenses.*.details.*.label' => 'required|string',
            'person.*.expenses.*.details.*.amount' => 'required|numeric',

            'documents' => 'nullable|array',
            'documents.*' => 'required|file|mimes:pdf,xlsx,xls,txt,doc,docx|max:10240',

            'note' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $guest_id = $request->guest_id();
            $response = (Object)[];
            $storedPersons = [];

            foreach ($data['person'] as $person) {
                // Save MultiStepForm_3 record
                $form = MultiStepForm_3::updateOrCreate([
                    'guest_id' => $guest_id,
                    'is_spouse' => $person['is_spouse'],
                ], [
                    'expense_documents' => $person['expense_documents'] ?? null,
                ]);

                // Save Expenses
                if (isset($person['expenses'])) {
                    foreach ($person['expenses'] as $expenseData) {
                        $expense = Expense::create([
                            'multi_step_form_3_id' => $form->id,
                            'label' => $expenseData['label'],
                            'total' => $expenseData['total'],
                            'estimated_annual_amount' => $expenseData['estimated_annual_amount'] ?? null,
                        ]);

                        // Save Expense Details
                        if (isset($expenseData['details'])) {
                            foreach ($expenseData['details'] as $detail) {
                                ExpenseDetail::create([
                                    'expense_id' => $expense->id,
                                    'label' => $detail['label'],
                                    'amount' => $detail['amount'],
                                ]);
                            }
                        }
                    }
                }

                $storedPersons[] = $form;
            }

            if(isset($data['documents']) && !empty($data['documents'])){
                foreach ($data['documents'] as $file) {
                    $documentOriginalName = $file->getClientOriginalName();
                    $filepath = FileManager::uploadFile($file);

                    $document = new Document([
                        'name' => $documentOriginalName,
                        'path' => $filepath,
                    ]);

                    // Save the document using the polymorphic relation
                    $form->documents()->save($document);

                    // Optional: attach to a response
                    $response->documents[] = $document;
                }
            }

            if (!empty($data['note'])) {
                Note::updateOrCreate([
                    'guest_id' => $guest_id,
                    'step' => 3.0,
                ], [
                    'note' => $data['note'],
                ]);
            }

            DB::commit();
            $response->person = $storedPersons;
            return ResponseTrait::success('Form 3 data saved successfully.', $response);
        } catch (\Throwable $th) {
            DB::rollBack();
            return ResponseTrait::error("Form 3 could not be saved: {$th->getMessage()}", null, 500);
        }
    }

    public static function get($guest_id, $step)
    {
        $data = Guest::where('id', $guest_id)
            ->with(self::TABLE_AND_RELATIONS)
            ->first();
        if($data->multiStepForm3->isEmpty()){
            return null;
        }
        $data['note'] = $data->noteForStep($step)->note;
        $data['step'] = (float)$step;
        return $data;
    }

    public const TABLE_AND_RELATIONS = ['multiStepForm3', 'multiStepForm3.documents', 'multiStepForm3.expenses', 'multiStepForm3.expenses.expenseDetails'];
}
