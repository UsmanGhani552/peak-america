<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('multi_step_form_1s', function (Blueprint $table) {
            $table->string('employment_info');
            $table->string('employment_info_description');
        });
    }

    public function down(): void
    {
        Schema::table('multi_step_form_1s', function (Blueprint $table) {
            $table->dropColumn(['employment_info', 'employment_info_description']);
        });
    }
};
