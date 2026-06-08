<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form - {{ $formData['uuid'] ?? 'N/A' }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: DejaVu Sans, "Helvetica Neue", Arial, sans-serif;
            font-size: 12px;
            color: #1f2937;
            background: #eef2f7;
            line-height: 1.45;
        }

        p { margin: 0; }

        .header {
            background: #0f4c81;
            color: #fff;
            padding: 22px 24px;
            margin-bottom: 24px;
            border-radius: 16px;
            box-shadow: 0 14px 32px rgba(15, 77, 129, 0.14);
        }
        .header h1 { font-size: 22px; margin-bottom: 6px; letter-spacing: 0.02em; }
        .header p { font-size: 12px; color: #f1f5fb; }
        .header-meta { margin-top: 14px; border-top: 1px solid #ffffff; padding-top: 12px; }
        .header-meta table { width: 100%; }
        .header-meta td { font-size: 11px; padding: 4px 0; color: #eaf2ff; }
        .header-meta td strong { color: #fff; }

        .section-card {
            background: #ffffff;
            border: 1px solid #dbe5ef;
            border-radius: 14px;
            padding: 18px 20px 20px;
            margin-bottom: 18px;
            box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
        }

        .step-title {
            display: inline-flex;
            align-items: center;
            background: #eff6ff;
            color: #0f4c81;
            padding: 10px 14px;
            font-size: 13px;
            font-weight: 700;
            border-radius: 999px;
            margin-bottom: 16px;
            border: 1px solid #c7ddff;
        }

        .columns {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }
        .col-header {
            font-size: 13px;
            font-weight: 700;
            text-align: center;
            background: #f8fafc;
            padding: 10px;
            color: #0f172a;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            margin-bottom: 10px;
        }

        table.info-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin-bottom: 14px;
        }
        table.info-table td {
            padding: 10px 10px;
            border-bottom: 1px solid #eef2f7;
            vertical-align: top;
        }
        table.info-table td.label {
            background: #f8fafc;
            font-weight: 700;
            width: 38%;
            color: #111827;
            border-right: 1px solid #e2e8f0;
        }

        table.data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            margin-bottom: 16px;
            box-shadow: 0 0 0 1px #e8edf3;
            border-radius: 10px;
            overflow: hidden;
        }
        table.data-table th,
        table.data-table td {
            padding: 10px 12px;
        }
        table.data-table th {
            background: #0f4c81;
            color: #fff;
            text-align: left;
            font-size: 11px;
            font-weight: 700;
            border-bottom: 1px solid #e2e8f0;
        }
        table.data-table td {
            background: #ffffff;
            border-bottom: 1px solid #eef2f7;
            font-size: 11px;
            color: #334155;
        }
        table.data-table tr:nth-child(even) td { background: #f8fafc; }
        table.data-table tr:last-child td { border-bottom: none; }

        .doc-list {
            list-style: none;
            padding: 0;
            margin: 0 0 16px 0;
        }
        .doc-list li {
            padding: 10px 12px;
            background: #f8fafc;
            border-radius: 10px;
            margin-bottom: 8px;
            font-size: 11px;
            color: #1f2937;
            border: 1px solid #e2e8f0;
        }

        .note-box {
            background: #eef6ff;
            border-left: 5px solid #3b82f6;
            padding: 12px 14px;
            margin-bottom: 14px;
            font-size: 11px;
            color: #102a43;
            border-radius: 10px;
        }

        .property-card {
            border: 1px solid #e2e8f0;
            padding: 14px 16px;
            margin-bottom: 12px;
            border-radius: 14px;
            background: #f8fbff;
        }
        .property-card h4 {
            font-size: 13px;
            color: #0f4c81;
            margin-bottom: 8px;
            text-transform: capitalize;
        }

        .sub-title {
            font-size: 12px;
            font-weight: 700;
            background: #f1f5f9;
            color: #0f172a;
            padding: 8px 12px;
            margin: 16px 0 10px;
            border-left: 5px solid #2563eb;
            border-radius: 8px;
        }

        .footer {
            margin-top: 32px;
            padding-top: 18px;
            text-align: center;
            font-size: 10px;
            color: #64748b;
        }

        .page-break { page-break-before: always; }
        @page { margin: 20mm; }
    </style>
</head>
<body>

    {{-- ══════════════════════════════════════════════════════
         HEADER
    ══════════════════════════════════════════════════════ --}}
    <div class="header">
        <h1>Peak America — Form Summary</h1>
        <p>Confidential Financial Planning Document</p>
        <div class="header-meta">
            <table>
                <tr>
                    <td><strong>Guest ID:</strong> {{ $formData['uuid'] ?? 'N/A' }}</td>
                    <td><strong>Generated:</strong> {{ now()->format('F j, Y  H:i') }}</td>
                    <td><strong>Assigned To:</strong> {{ $formData['form_assigned_to'] ?? 'Unassigned' }}</td>
                </tr>
            </table>
        </div>
    </div>

    {{-- ══════════════════════════════════════════════════════
         LOOP THROUGH FORM STEPS
    ══════════════════════════════════════════════════════ --}}
    @foreach($formData['forms'] as $formStep)
        @php
            $step       = $formStep->step;
            $note       = $formStep->note ?? null;
            $primary    = collect($formStep->form)->first(fn($f) => !$f->is_spouse);
            $spouse     = collect($formStep->form)->first(fn($f) => $f->is_spouse);
            $stepNames  = [
                1   => 'Step 1 — Personal Information',
                2.1 => 'Step 2.1 — Financial Assets',
                2.2 => 'Step 2.2 — Additional Assets',
                3   => 'Step 3 — Expenses',
                4   => 'Step 4 — Property',
                5   => 'Step 5 — Questionnaire (Value)',
                6   => 'Step 6 — Questionnaire (Retirement)',
            ];
        @endphp

        {{-- Step heading --}}
        <div class="step-title">{{ $stepNames[$step] ?? 'Step '.$step }}</div>
        <div class="section-card">

        {{-- Note --}}
        @if($note)
            <div class="note-box"><strong>Note:</strong> {{ $note }}</div>
        @endif

        {{-- Documents (Step 3 only) --}}
        @if(isset($formStep->documents) && count($formStep->documents) > 0)
            <div class="sub-title">Supporting Documents</div>
            <ul class="doc-list">
                @foreach($formStep->documents as $doc)
                    <li>📄 {{ $doc['name'] ?? $doc->name ?? 'Document' }}</li>
                @endforeach
            </ul>
        @endif

        {{-- ── STEP 1: Personal Info ──────────────────────── --}}
        @if($step == 1)
            <table class="columns">
                <tr>
                    <td style="width:50%; padding-right:6px; vertical-align:top;">
                        <div class="col-header">You</div>
                        @if($primary)
                            <table class="info-table">
                                <tr><td class="label">Name</td><td>{{ $primary->first_name ?? '' }} {{ $primary->last_name ?? '' }}</td></tr>
                                <tr><td class="label">Age</td><td>{{ $primary->age ?? 'N/A' }}</td></tr>
                                <tr><td class="label">Email</td><td>{{ $primary->email ?? 'N/A' }}</td></tr>
                                <tr><td class="label">Phone</td><td>{{ $primary->cell_phone ?? 'N/A' }}</td></tr>
                                <tr><td class="label">Marital Status</td><td>{{ $primary->marital_status ?? 'N/A' }}</td></tr>
                                <tr><td class="label">Employment</td><td>{{ $primary->employment_info ?? 'N/A' }}</td></tr>
                            </table>
                            @if(!empty($primary->kids) && count($primary->kids) > 0)
                                <div class="sub-title">Children</div>
                                <table class="data-table">
                                    <tr><th>#</th><th>Age</th></tr>
                                    @foreach($primary->kids as $i => $kid)
                                        <tr><td>{{ $i + 1 }}</td><td>{{ $kid->age ?? $kid['age'] ?? 'N/A' }}</td></tr>
                                    @endforeach
                                </table>
                            @endif
                        @else
                            <p style="color:#999;padding:6px;">No data available</p>
                        @endif
                    </td>
                    <td style="width:50%; padding-left:6px; vertical-align:top;">
                        <div class="col-header">Spouse</div>
                        @if($spouse)
                            <table class="info-table">
                                <tr><td class="label">Name</td><td>{{ $spouse->first_name ?? '' }} {{ $spouse->last_name ?? '' }}</td></tr>
                                <tr><td class="label">Age</td><td>{{ $spouse->age ?? 'N/A' }}</td></tr>
                                <tr><td class="label">Email</td><td>{{ $spouse->email ?? 'N/A' }}</td></tr>
                                <tr><td class="label">Phone</td><td>{{ $spouse->cell_phone ?? 'N/A' }}</td></tr>
                                <tr><td class="label">Marital Status</td><td>{{ $spouse->marital_status ?? 'N/A' }}</td></tr>
                                <tr><td class="label">Employment</td><td>{{ $spouse->employment_info ?? 'N/A' }}</td></tr>
                            </table>
                            @if(!empty($spouse->kids) && count($spouse->kids) > 0)
                                <div class="sub-title">Children</div>
                                <table class="data-table">
                                    <tr><th>#</th><th>Age</th></tr>
                                    @foreach($spouse->kids as $i => $kid)
                                        <tr><td>{{ $i + 1 }}</td><td>{{ $kid->age ?? $kid['age'] ?? 'N/A' }}</td></tr>
                                    @endforeach
                                </table>
                            @endif
                        @else
                            <p style="color:#999;padding:6px;">No data available</p>
                        @endif
                    </td>
                </tr>
            </table>

        {{-- ── STEP 2.1: Financial Assets ──────────────────── --}}
        @elseif($step == 2.1)
            <table class="columns">
                <tr>
                    <td style="width:50%; padding-right:6px; vertical-align:top;">
                        <div class="col-header">You</div>
                        @if($primary)
                            <table class="info-table">
                                <tr><td class="label">Checking / Savings</td><td>${{ number_format($primary->checking_savings ?? 0) }}</td></tr>
                                <tr><td class="label">CDs</td><td>${{ number_format($primary->cds ?? 0) }}</td></tr>
                                <tr><td class="label">Stocks / Bonds / Brokerage</td><td>${{ number_format($primary->stocks_bonds_brokerage ?? 0) }}</td></tr>
                                <tr><td class="label">IRAs (Pre-tax)</td><td>${{ number_format($primary->iras_pre_tax ?? 0) }}</td></tr>
                                <tr><td class="label">Roth IRAs</td><td>${{ number_format($primary->roth_iras ?? 0) }}</td></tr>
                                <tr><td class="label">Other Funds</td><td>${{ number_format($primary->other_funds ?? 0) }}</td></tr>
                                <tr><td class="label">Qualified Retirement</td><td>${{ number_format($primary->qualified_retirement_accounts ?? 0) }}</td></tr>
                                <tr><td class="label" style="color:#1a3c5e;">Total</td><td style="font-weight:bold;">${{ number_format($primary->total ?? 0) }}</td></tr>
                            </table>
                        @else
                            <p style="color:#999;padding:6px;">No data available</p>
                        @endif
                    </td>
                    <td style="width:50%; padding-left:6px; vertical-align:top;">
                        <div class="col-header">Spouse</div>
                        @if($spouse)
                            <table class="info-table">
                                <tr><td class="label">Checking / Savings</td><td>${{ number_format($spouse->checking_savings ?? 0) }}</td></tr>
                                <tr><td class="label">CDs</td><td>${{ number_format($spouse->cds ?? 0) }}</td></tr>
                                <tr><td class="label">Stocks / Bonds / Brokerage</td><td>${{ number_format($spouse->stocks_bonds_brokerage ?? 0) }}</td></tr>
                                <tr><td class="label">IRAs (Pre-tax)</td><td>${{ number_format($spouse->iras_pre_tax ?? 0) }}</td></tr>
                                <tr><td class="label">Roth IRAs</td><td>${{ number_format($spouse->roth_iras ?? 0) }}</td></tr>
                                <tr><td class="label">Other Funds</td><td>${{ number_format($spouse->other_funds ?? 0) }}</td></tr>
                                <tr><td class="label">Qualified Retirement</td><td>${{ number_format($spouse->qualified_retirement_accounts ?? 0) }}</td></tr>
                                <tr><td class="label" style="color:#1a3c5e;">Total</td><td style="font-weight:bold;">${{ number_format($spouse->total ?? 0) }}</td></tr>
                            </table>
                        @else
                            <p style="color:#999;padding:6px;">No data available</p>
                        @endif
                    </td>
                </tr>
            </table>

        {{-- ── STEP 2.2: Additional Assets ─────────────────── --}}
        @elseif($step == 2.2)
            <table class="columns">
                <tr>
                    <td style="width:50%; padding-right:6px; vertical-align:top;">
                        <div class="col-header">You</div>
                        @if($primary)
                            <table class="info-table">
                                <tr><td class="label">Annuities</td><td>${{ number_format($primary->annuities ?? 0) }}</td></tr>
                                <tr><td class="label">Lump Sum Pension</td><td>${{ number_format($primary->lump_sum_pension ?? 0) }}</td></tr>
                                <tr><td class="label">Long Term Care Insurance</td><td>${{ number_format($primary->long_term_care_insurance ?? 0) }}</td></tr>
                                <tr><td class="label">Life Insurance</td><td>${{ number_format($primary->life_insurance ?? 0) }}</td></tr>
                                <tr><td class="label">Business Interest</td><td>${{ number_format($primary->business_interest ?? 0) }}</td></tr>
                                <tr><td class="label">Other Assets</td><td>${{ number_format($primary->other_assets ?? 0) }}</td></tr>
                                <tr><td class="label" style="color:#1a3c5e;">Total</td><td style="font-weight:bold;">${{ number_format($primary->total ?? 0) }}</td></tr>
                            </table>
                        @else
                            <p style="color:#999;padding:6px;">No data available</p>
                        @endif
                    </td>
                    <td style="width:50%; padding-left:6px; vertical-align:top;">
                        <div class="col-header">Spouse</div>
                        @if($spouse)
                            <table class="info-table">
                                <tr><td class="label">Annuities</td><td>${{ number_format($spouse->annuities ?? 0) }}</td></tr>
                                <tr><td class="label">Lump Sum Pension</td><td>${{ number_format($spouse->lump_sum_pension ?? 0) }}</td></tr>
                                <tr><td class="label">Long Term Care Insurance</td><td>${{ number_format($spouse->long_term_care_insurance ?? 0) }}</td></tr>
                                <tr><td class="label">Life Insurance</td><td>${{ number_format($spouse->life_insurance ?? 0) }}</td></tr>
                                <tr><td class="label">Business Interest</td><td>${{ number_format($spouse->business_interest ?? 0) }}</td></tr>
                                <tr><td class="label">Other Assets</td><td>${{ number_format($spouse->other_assets ?? 0) }}</td></tr>
                                <tr><td class="label" style="color:#1a3c5e;">Total</td><td style="font-weight:bold;">${{ number_format($spouse->total ?? 0) }}</td></tr>
                            </table>
                        @else
                            <p style="color:#999;padding:6px;">No data available</p>
                        @endif
                    </td>
                </tr>
            </table>

        {{-- ── STEP 3: Expenses ─────────────────────────────── --}}
        @elseif($step == 3)
            @php
                $grouped = [];
                $allForms = $formStep->form ?? [];
                foreach ($allForms as $f) {
                    if (!empty($f->expenses)) {
                        foreach ($f->expenses as $expense) {
                            $lbl = $expense->label ?? 'Other';
                            if (!isset($grouped[$lbl])) {
                                $grouped[$lbl] = [
                                    'label'    => ucwords(str_replace('_', ' ', $lbl)),
                                    'total'    => $expense->total ?? 0,
                                    'annual'   => $expense->estimated_annual_amount ?? null,
                                    'items'    => [],
                                    'is_spouse'=> $f->is_spouse ?? false,
                                ];
                            }
                            if (!empty($expense->expense_details)) {
                                foreach ($expense->expense_details as $detail) {
                                    $grouped[$lbl]['items'][] = $detail;
                                }
                            }
                        }
                    }
                }
            @endphp

            @if(!empty($grouped))
                @foreach($grouped as $key => $cat)
                    <div class="sub-title">
                        {{ $cat['label'] }}
                        @if($cat['is_spouse']) &nbsp;<em style="font-weight:normal;">(Spouse)</em>@endif
                    </div>
                    @if($cat['annual'] !== null && $cat['label'] !== 'Large Expense')
                        <p style="padding:2px 8px;"><strong>Estimated Annual Amount:</strong> ${{ number_format($cat['annual']) }}</p>
                    @endif
                    @if(!empty($cat['items']))
                        <table class="data-table">
                            <tr>
                                <th>{{ $cat['label'] === 'Large Expense' ? 'Description' : ($cat['label'] === 'Liabilities' ? 'Monthly Liability' : 'Monthly Expense') }}</th>
                                <th>Amount</th>
                            </tr>
                            @foreach($cat['items'] as $item)
                                <tr>
                                    <td>{{ $item->label ?? $item['label'] ?? 'N/A' }}</td>
                                    <td>${{ number_format($item->amount ?? $item['amount'] ?? 0) }}</td>
                                </tr>
                            @endforeach
                        </table>
                    @else
                        <p style="color:#999;padding:4px 8px;">No items recorded.</p>
                    @endif
                @endforeach
            @else
                <p style="color:#999;padding:6px;">No expense information available.</p>
            @endif

        {{-- ── STEP 4: Property ─────────────────────────────── --}}
        @elseif($step == 4)
            @php $allForms = $formStep->form ?? []; @endphp
            @foreach($allForms as $f)
                @if(!empty($f->property) && count($f->property) > 0)
                    <div class="sub-title">{{ $f->is_spouse ? 'Spouse' : 'You' }}</div>
                    @foreach($f->property as $prop)
                        <div class="property-card">
                            <h4>{{ $prop->type ?? $prop['type'] ?? 'Property' }} Property</h4>
                            <table class="info-table">
                                <tr><td class="label">Address</td><td>{{ $prop->address ?? $prop['address'] ?? 'N/A' }}</td></tr>
                                <tr><td class="label">Value</td><td>${{ number_format($prop->value ?? $prop['value'] ?? 0) }}</td></tr>
                            </table>
                        </div>
                    @endforeach
                @endif
            @endforeach

        {{-- ── STEP 5 & 6: Questionnaires ──────────────────── --}}
        @elseif($step == 5 || $step == 6)
            @php $allForms = $formStep->form ?? []; @endphp
            @foreach($allForms as $f)
                @if(!empty($f->question_answers) && count($f->question_answers) > 0)
                    <div class="sub-title">{{ $f->is_spouse ? 'Spouse' : 'You' }}</div>
                    <table class="data-table">
                        <tr><th style="width:60%;">Question</th><th>Answer</th></tr>
                        @foreach($f->question_answers as $qa)
                            <tr>
                                <td>{{ $qa->question ?? $qa['question'] ?? 'N/A' }}</td>
                                <td>{{ $qa->answer ?? $qa['answer'] ?? 'N/A' }}</td>
                            </tr>
                        @endforeach
                    </table>
                @endif
            @endforeach

        @endif

        </div>
    @endforeach

    {{-- ══════════════════════════════════════════════════════
         FOOTER
    ══════════════════════════════════════════════════════ --}}
    <div class="footer">
        <p>Peak America &mdash; Confidential Financial Planning Document &mdash; Generated {{ now()->format('F j, Y') }}</p>
        <p style="margin-top:3px;">Guest ID: {{ $formData['uuid'] ?? 'N/A' }}</p>
    </div>

</body>
</html>
