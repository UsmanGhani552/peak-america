<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuestionAnswer extends Model
{
    protected $fillable = [
        'question_id',
        'answer',
        'questionable_id',
        'questionable_type',
    ];

    public function questionable()
    {
        return $this->morphTo();
    }
}
