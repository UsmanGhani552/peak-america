<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = [
        'question',
    ];

    protected $casts = [
        'created_at' => 'string',
    ];
}
