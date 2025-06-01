<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('multi_step_form_1s', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guest_id')->constrained()->onDelete('cascade');
            $table->boolean('is_spouse')->default(false);
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->integer('age')->nullable();
            $table->string('cell_phone')->nullable();
            $table->string('email')->nullable();
            $table->string('marital_status')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('multi_step_form_1s');
    }
};
