<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guest extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid'
    ];


    public function multiStepForm1()
    {
        return $this->hasMany(MultiStepForm_1::class, 'guest_id');
    }
    public function multiStepForm2_1()
    {
        return $this->hasMany(MultiStepForm_2_1::class, 'guest_id');
    }
    public function multiStepForm2_2()
    {
        return $this->hasMany(MultiStepForm_2_2::class, 'guest_id');
    }
    public function multiStepForm3()
    {
        return $this->hasMany(MultiStepForm_3::class, 'guest_id');
    }
    public function multiStepForm4()
    {
        return $this->hasMany(MultiStepForm_4::class, 'guest_id');
    }
    public function multiStepForm5()
    {
        return $this->hasMany(MultiStepForm_5::class, 'guest_id');
    }
    public function multiStepForm6()
    {
        return $this->hasMany(MultiStepForm_6::class, 'guest_id');
    }

    public function note()
    {
        return $this->hasMany(Note::class, 'guest_id');
    }

    public function noteForStep($step)
    {
        return $this->note()->where('step', $step)->first()?? null;
    }
    public function formAssigned()
    {
        return $this->hasMany(FormAssignment::class, 'guest_id');
    }
}
