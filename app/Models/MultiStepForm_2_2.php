<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MultiStepForm_2_2 extends Model
{
    use HasFactory;

    protected $fillable = [
        'guest_id',
        'is_spouse',

        'annuities',
        'lump_sum_pension',
        'long_term_care_insurance',
        'life_insurance',
        'business_interest',
        'other_assets',
        'total',
    ];

    protected $casts = [
        'is_spouse' => 'boolean',

        'annuities' => 'decimal:2',
        'lump_sum_pension' => 'decimal:2',
        'long_term_care_insurance' => 'decimal:2',
        'life_insurance' => 'decimal:2',
        'business_interest' => 'decimal:2',
        'other_assets' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function guest()
    {
        return $this->belongsTo(Guest::class);
    }
}
