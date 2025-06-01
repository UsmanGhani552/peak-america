<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MultiStepForm_2_1 extends Model
{
    use HasFactory;

    protected $fillable = [
        'guest_id',
        'is_spouse',

        'checking_savings',
        'cds',
        'stocks_bonds_brokerage',
        'iras_pre_tax',
        'roth_iras',
        'other_funds',
        'qualified_retirement_accounts',
        'total',
        'note',
    ];

    protected $casts = [
        'is_spouse' => 'boolean',

        'checking_savings' => 'decimal:2',
        'cds' => 'decimal:2',
        'stocks_bonds_brokerage' => 'decimal:2',
        'iras_pre_tax' => 'decimal:2',
        'roth_iras' => 'decimal:2',
        'other_funds' => 'decimal:2',
        'qualified_retirement_accounts' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function guest()
    {
        return $this->belongsTo(Guest::class);
    }
}
