<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form - {{ $formData['uuid'] ?? 'N/A' }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            color: #222;
            background: #fff;
        }

        /* ── Header ─────────────────────────────────────────── */
        .header {
            background: #1a3c5e;
            color: #fff;
            padding: 18px 24px;
            margin-bottom: 20px;
        }
        .header h1 { font-size: 20px; margin-bottom: 4px; }
        .header p  { font-size: 11px; opacity: 0.85; }
        .header-meta {
            margin-top: 10px;
            border-top: 1px solid rgba(255,255,255,0.3);
            padding-top: 8px;
        }
        .header-meta table { width: 100%; }
        .header-meta td { font-size: 11px; padding: 2px 0; color: #e0eaf6; }
        .header-meta td strong { color: #fff; }

        /* ── Section titles ──────────────────────────────────── */
        .step-title {
            background: #2563eb;
            color: #fff;
            padding: 7px 12px;
            font-size: 13px;
            font-weight: bold;
            margin: 20px 0 10px 0;
            border-radius: 3px;
        }

        /* ── Two-column layout (You / Spouse) ───────────────── */
        .columns { width: 100%; }
        .col-header {
            font-size: 12px;
            font-weight: bold;
            text-align: center;
            background: #f1f5f9;
            padding: 5px;
            border: 1px solid #d1d5db;
            margin-bottom: 4px;
        }

        /* ── Generic info table ──────────────────────────────── */
        table.info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        table.info-table td {
            padding: 5px 8px;
            border: 1px solid #e2e8f0;
            vertical-align: top;
        }
        table.info-table td.label {
            background: #f8fafc;
            font-weight: bold;
            width: 40%;
            color: #374151;
        }

        /* ── Data table (expenses / Q&A) ─────────────────────── */
        table.data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 6px;
            margin-bottom: 12px;
        }
        table.data-table th {
            background: #1a3c5e;
            color: #fff;
            padding: 6px 8px;
            text-align: left;
            font-size: 11px;
        }
        table.data-table td {
            padding: 5px 8px;
            border: 1px solid #e2e8f0;
            vertical-align: top;
        }
        table.data-table tr:nth-child(even) td { background: #f8fafc; }

        /* ── Documents list ──────────────────────────────────── */
        .doc-list { list-style: none; padding: 0; }
        .doc-list li {
            padding: 4px 8px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 11px;
        }

        /* ── Note box ────────────────────────────────────────── */
        .note-box {
            background: #fef9c3;
            border-left: 4px solid #ca8a04;
            padding: 7px 10px;
            margin-bottom: 10px;
            font-size: 11px;
        }

        /* ── Property card ───────────────────────────────────── */
        .property-card {
            border: 1px solid #d1d5db;
            padding: 8px 10px;
            margin-bottom: 8px;
            border-radius: 3px;
        }
        .property-card h4 {
            font-size: 12px;
            color: #1a3c5e;
            margin-bottom: 4px;
            text-transform: capitalize;
        }

        /* ── Sub-section title ───────────────────────────────── */
        .sub-title {
            font-size: 11px;
            font-weight: bold;
            background: #e0eaf6;
            padding: 4px 8px;
            margin: 10px 0 4px 0;
            border-left: 3px solid #2563eb;
        }

        /* ── Footer ──────────────────────────────────────────── */
        .footer {
            margin-top: 30px;
            border-top: 1px solid #d1d5db;
            padding-top: 8px;
            text-align: center;
            font-size: 10px;
            color: #6b7280;
        }

        /* ── Page-break helper ───────────────────────────────── */
        .page-break { page-break-before: always; }
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
