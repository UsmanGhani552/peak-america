<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('expenses', 'total')) {
            Schema::table('expenses', function (Blueprint $table) {
                $table->dropColumn('total');
            });
        }

        if (Schema::hasColumn('expense_details', 'amount')) {
            Schema::table('expense_details', function (Blueprint $table) {
                $table->dropColumn('amount');
            });
        }
    }

    public function down(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->decimal('total', 10, 2)->nullable();
        });

        Schema::table('expense_details', function (Blueprint $table) {
            $table->decimal('amount', 10, 2)->nullable();
        });
    }
};
