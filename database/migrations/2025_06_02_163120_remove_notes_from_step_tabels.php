<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Remove 'note' column from all multi_step_form tables if exists
        $tables = [
            'multi_step_form_1s',
            'multi_step_form_2_1s',
            'multi_step_form_2_2s',
            'multi_step_form_4s',
            'multi_step_form_5s',
            'multi_step_form_6s',
        ];

        foreach ($tables as $table) {
            if (Schema::hasColumn($table, 'note')) {
                Schema::table($table, function (Blueprint $table) {
                    $table->dropColumn('note');
                });
            }
            if (Schema::hasColumn($table, 'notes')) {
                Schema::table($table, function (Blueprint $table) {
                    $table->dropColumn('notes');
                });
            }
        }
    }

    public function down(): void
    {
        // Add 'note' column back as nullable text
        $tables = [
            'multi_step_form_1s',
            'multi_step_form_2_1s',
            'multi_step_form_2_2s',
            'multi_step_form_4s',
            'multi_step_form_5s',
            'multi_step_form_6s',
        ];

        foreach ($tables as $table) {
            if (!Schema::hasColumn($table, 'note')) {
                Schema::table($table, function (Blueprint $table) {
                    $table->text('note')->nullable();
                });
            }
            if (!Schema::hasColumn($table, 'notes')) {
                Schema::table($table, function (Blueprint $table) {
                    $table->text('notes')->nullable();
                });
            }
        }
    }
};
