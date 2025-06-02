<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('multi_step_form_6s', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->foreignId('guest_id')->constrained()->onDelete('cascade');
            $table->boolean('is_spouse')->default(false);
            $table->text('note')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('multi_step_form_6s');
    }
};
