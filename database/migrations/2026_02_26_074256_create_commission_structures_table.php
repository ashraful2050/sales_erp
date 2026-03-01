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
        Schema::create('commission_structures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('type'); // percentage, fixed, tiered
            $table->decimal('rate', 8, 4)->default(0); // commission rate
            $table->json('tiers')->nullable(); // tiered commission rules
            $table->string('applies_to')->default('all'); // all, product, category, customer
            $table->unsignedBigInteger('applies_to_id')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commission_structures');
    }
};
