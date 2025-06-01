<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('multi_step_form_2_2s', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guest_id')->constrained()->onDelete('cascade');
            $table->boolean('is_spouse')->default(false);

            $table->decimal('annuities', 15, 2)->nullable();
            $table->decimal('lump_sum_pension', 15, 2)->nullable();
            $table->decimal('long_term_care_insurance', 15, 2)->nullable();
            $table->decimal('life_insurance', 15, 2)->nullable();
            $table->decimal('business_interest', 15, 2)->nullable();
            $table->decimal('other_assets', 15, 2)->nullable();
            $table->decimal('total', 15, 2)->nullable();
            $table->text('note')->nullable();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('multi_step_form_2_2s');
    }
};
