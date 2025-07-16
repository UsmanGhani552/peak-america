<?php

namespace App\Services\FormSteps;

use App\Models\Guest;
use App\Models\Kid;
use App\Models\MultiStepForm_2_1;
use App\Models\Note;
use App\Traits\ResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class FormStep2_1Handler implements FormStepHandlerInterface
{
    use ResponseTrait;

    public function submit(Request $request): JsonResponse
    {
        // Validate and process the request data
        $data = $request->validate([
            'person' => 'required|array|min:1|max:2',
            'person.*.is_spouse' => 'required|boolean',

            'person.*.checking_savings' => 'nullable|numeric',
            'person.*.cds' => 'nullable|numeric',
            'person.*.stocks_bonds_brokerage' => 'nullable|numeric',
            'person.*.iras_pre_tax' => 'nullable|numeric',
            'person.*.roth_iras' => 'nullable|numeric',
            'person.*.other_funds' => 'nullable|numeric',
            'person.*.qualified_retirement_accounts' => 'nullable|numeric',
            'person.*.total' => 'numeric',
            'note' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();
            $guest_id = $request->guest_id();
            $personsInDB = [];
            $amounts = [];
            foreach ($data['person'] as $person) {
                $amounts[] =
                    ($person['checking_savings'] ?? 0) +
                    ($person['cds'] ?? 0) +
                    ($person['stocks_bonds_brokerage'] ?? 0) +
                    ($person['iras_pre_tax'] ?? 0) +
                    ($person['roth_iras'] ?? 0) +
                    ($person['other_funds'] ?? 0) +
                    ($person['qualified_retirement_accounts'] ?? 0);

                $personsInDB[] = MultiStepForm_2_1::updateOrCreate([
                    'guest_id' => $guest_id,
                    'is_spouse' => $person['is_spouse'],
                ], [
                    'checking_savings' => $person['checking_savings'] ?? null,
                    'cds' => $person['cds'] ?? null,
                    'stocks_bonds_brokerage' => $person['stocks_bonds_brokerage'] ?? null,
                    'iras_pre_tax' => $person['iras_pre_tax'] ?? null,
                    'roth_iras' => $person['roth_iras'] ?? null,
                    'other_funds' => $person['other_funds'] ?? null,
                    'qualified_retirement_accounts' => $person['qualified_retirement_accounts'] ?? null,
                    'total' => $person['total'] ?? null,
                ]);
            }

            if($data['note']){
                Note::updateOrCreate([
                    'guest_id' => $guest_id,
                    'step' => 2.1,
                ], [
                    'note' => $data['note']
                ]);
            }

            $total_amounts = 0;
            foreach ($amounts as $index => $amount) {
                $total_amounts += $amount;

                if($amount !== $data['person'][$index]['total']) {
                    return ResponseTrait::error('Total amounts do not match the number of persons. Its off by ' . abs($amount - $data['person'][$index]['total']));
                }
            }
            if($total_amounts === 0) {
                return ResponseTrait::error('Total amount can\'t be zero.');
            }
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            return ResponseTrait::error("Form 2.1 can't be saved due to {$th->getMessage()}", null, 500);
        }

        return ResponseTrait::success('Form 2.1 data saved successfully.', $data);
    }

    public static function get($guest_id, $step)
    {
        $data = Guest::where('id', $guest_id)
            ->with(['multiStepForm2_1'])
            ->first();
        if($data->multiStepForm2_1->isEmpty()){
            return null;
        }
        $data['note'] = $data->noteForStep($step)->note?? null;
        $data['step'] = (float)$step;
        return $data;
    }

    public const TABLE_AND_RELATIONS = ['multiStepForm2_1'];
}
