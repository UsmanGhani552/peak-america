<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    protected $fillable = [
        'multi_step_form_4_id',

        'type',
        'address',
        'value',
    ];
    protected $casts = [
        'is_spouse' => 'boolean',
    ];

    public function form()
    {
        return $this->belongsTo(MultiStepForm_4::class, 'multi_step_form_4_id');
    }
}
