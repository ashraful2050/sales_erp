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
        Schema::create('pricing_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('type'); // fixed, percentage, tiered, dynamic
            $table->string('applies_to'); // all, category, product, customer, segment
            $table->unsignedBigInteger('applies_to_id')->nullable();
            $table->decimal('adjustment_value', 10, 4)->default(0); // % or fixed amount
            $table->string('adjustment_type')->default('percentage'); // percentage, fixed
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->integer('priority')->default(0);
            $table->boolean('is_active')->default(true);
            $table->text('conditions')->nullable(); // JSON conditions
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pricing_rules');
    }
};
