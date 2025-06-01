<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('multi_step_form_2_1s', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guest_id')->constrained()->onDelete('cascade');
            $table->boolean('is_spouse')->default(false);

            $table->decimal('checking_savings', 15, 2)->nullable();
            $table->decimal('cds', 15, 2)->nullable();
            $table->decimal('stocks_bonds_brokerage', 15, 2)->nullable();
            $table->decimal('iras_pre_tax', 15, 2)->nullable();
            $table->decimal('roth_iras', 15, 2)->nullable();
            $table->decimal('other_funds', 15, 2)->nullable();
            $table->decimal('qualified_retirement_accounts', 15, 2)->nullable();
            $table->decimal('total', 15, 2)->nullable();
            $table->text('note')->nullable();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('multi_step_form_2_1s');
    }
};
