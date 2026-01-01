<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExpenseDetail extends Model
{
    protected $fillable = [
        'expense_id',

        'label'
    ];
    protected $casts = [
        'is_spouse' => 'boolean',
    ];

    public function expense()
    {
        return $this->belongsTo(Expense::class, 'expense_id');
    }
}
