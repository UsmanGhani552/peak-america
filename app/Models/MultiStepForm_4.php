<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MultiStepForm_4 extends Model
{
    use HasFactory;

    protected $fillable = [
        'guest_id',
        'is_spouse',

        'notes',
    ];

    protected $casts = [
        'is_spouse' => 'boolean',
    ];

    public function property()
    {
        return $this->hasMany(Property::class);
    }

    public function guest()
    {
        return $this->belongsTo(Guest::class);
    }
}
