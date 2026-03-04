<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        try {
            Schema::table('invoices', function (Blueprint $table) {
                $table->dropForeign(['customer_id']);
            });
        } catch (\Exception $e) {
            // foreign key may not exist, continue
        }

        Schema::table('invoices', function (Blueprint $table) {
            $table->unsignedBigInteger('customer_id')->nullable()->change();
            $table->foreign('customer_id')->references('id')->on('customers')->nullOnDelete();
        });
    }

    public function down(): void
    {
        // Remove any invoices with a NULL customer_id before reverting the column to NOT NULL
        DB::table('invoices')->whereNull('customer_id')->delete();

        try {
            Schema::table('invoices', function (Blueprint $table) {
                $table->dropForeign(['customer_id']);
            });
        } catch (\Exception $e) {
            // foreign key may not exist, continue
        }

        Schema::table('invoices', function (Blueprint $table) {
            $table->unsignedBigInteger('customer_id')->nullable(false)->change();
            $table->foreign('customer_id')->references('id')->on('customers')->cascadeOnDelete();
        });
    }
};
