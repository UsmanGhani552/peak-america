<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $fillable = [
        'multi_step_form_3_id',

        'label',
        'estimated_annual_amount',
    ];
    protected $casts = [
        'is_spouse' => 'boolean',
    ];

    public function form()
    {
        return $this->belongsTo(MultiStepForm_3::class, 'multi_step_form_3_id');
    }
    public function expenseDetails()
    {
        return $this->hasMany(ExpenseDetail::class);
    }
}
