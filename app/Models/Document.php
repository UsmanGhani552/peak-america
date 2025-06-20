<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $fillable = [
        'relation_id',
        'relation_type',
        'name',
        'path',
    ];
    public function relation()
    {
        return $this->morphTo();
    }
}
