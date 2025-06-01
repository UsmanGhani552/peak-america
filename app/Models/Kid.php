<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kid extends Model
{
    use HasFactory;

    protected $fillable = [
        'age',
        'multi_step_form_1_id'
    ];

    protected $casts = [
        'is_spouse' => 'boolean',
        'age' => 'int',
    ];

    public function kids()
    {
        return $this->hasMany(Kid::class);
    }

    public function form()
    {
        return $this->belongsTo(MultiStepForm_1::class, 'multi_step_form_1_id');
    }
}
