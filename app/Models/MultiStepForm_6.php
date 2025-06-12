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

    public function questions()
    {
        return $this->hasManyThrough(
            Question::class,
            QuestionAnswer::class,
            'questionable_id', // Foreign key on QuestionAnswer table
            'id', // Foreign key on Question table
            'id', // Local key on MultiStepForm_5 table
            'question_id' // Local key on QuestionAnswer table
        );
    }
}
