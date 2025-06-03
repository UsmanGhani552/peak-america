<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    use HasFactory;

    protected $fillable = [
        'guest_id',
        'step',
        'note',
    ];

    public function guest()
    {
        return $this->belongsTo(Guest::class);
    }

    public function step()
    {
        return $this->belongsTo(MultiStepForm::class);
    }
}
