<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MultiStepForm_3 extends Model
{
    use HasFactory;

    protected $fillable = [
        'guest_id',
        'is_spouse',
    ];

    protected $casts = [
        'is_spouse' => 'boolean',
    ];

    public function guest()
    {
        return $this->belongsTo(Guest::class);
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    public function documents()
    {
        return $this->morphMany(Document::class, 'relation');
    }

}
