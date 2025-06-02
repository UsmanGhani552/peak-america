<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MultiStepForm_6 extends Model
{
    use HasFactory;

    protected $fillable = [
        'guest_id',
        'is_spouse',

        'note',
    ];

    protected $casts = [
        'is_spouse' => 'boolean',
    ];

    public function guest()
    {
        return $this->belongsTo(Guest::class);
    }

    public function questionAnswers()
    {
        return $this->morphMany(QuestionAnswer::class, 'questionable');
    }
}
