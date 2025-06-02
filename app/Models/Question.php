<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = [
        'question',
        'step_id',
    ];

    protected $casts = [
        'created_at' => 'string',
    ];
}
