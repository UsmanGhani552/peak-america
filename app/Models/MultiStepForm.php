<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MultiStepForm extends Model
{
    protected $fillable = [
        'step',
    ];

    public function questions()
    {
        return $this->hasMany(Question::class, 'step_id');
    }
}
