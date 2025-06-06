<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->unsignedBigInteger('step_id')->nullable()->after('id');
            $table->foreign('step_id')->references('id')->on('multi_step_forms')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropForeign(['step_id']);
            $table->dropColumn('step_id');
        });
    }
};
