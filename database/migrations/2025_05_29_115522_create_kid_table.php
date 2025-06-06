<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('kids', function (Blueprint $table) {
            $table->id();
            $table->foreignId('multi_step_form_1_id')->constrained()->onDelete('cascade');
            $table->integer('age');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('kids');
    }
};
