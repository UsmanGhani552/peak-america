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
        Schema::table('multi_step_form_1s', function (Blueprint $table) {
            $table->dropColumn('age');
            $table->timestamp('age')->nullable()->after('last_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('multi_step_form_1s', function (Blueprint $table) {
            $table->dropColumn('age');
            $table->integer('age')->nullable()->after('last_name');
        });
    }
};
