<?php

use App\Enums\ExpenseType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('multi_step_form_3_id')->constrained('multi_step_form_3s')->onDelete('cascade');
            $table->enum('label', array_column(ExpenseType::cases(), 'value')); // define enum values
            $table->decimal('total', 10, 2)->nullable();
            $table->decimal('estimated_annual_amount', 10, 2)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
