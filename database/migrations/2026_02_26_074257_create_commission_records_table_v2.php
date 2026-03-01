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
        Schema::create('commission_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // sales rep
            $table->foreignId('commission_structure_id')->constrained()->cascadeOnDelete();
            $table->string('reference_type'); // invoice
            $table->unsignedBigInteger('reference_id');
            $table->decimal('sale_amount', 20, 4);
            $table->decimal('commission_amount', 20, 4);
            $table->string('status')->default('pending'); // pending, approved, paid
            $table->date('period_date');
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->date('paid_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commission_records');
    }
};
