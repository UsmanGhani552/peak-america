<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MultiStepForm_1 extends Model
{
    use HasFactory;

    protected $fillable = [
        'guest_id',
        'is_spouse',
        'first_name',
        'last_name',
        'age',
        'cell_phone',
        'email',
        'marital_status',
    ];

    protected $casts = [
        'is_spouse' => 'boolean',
        'marital_status' => 'string',
    ];

    public function kids()
    {
        return $this->hasMany(Kid::class);
    }

    public function guest()
    {
        return $this->belongsTo(Guest::class);
    }
}
