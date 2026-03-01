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
        Schema::create('loyalty_programs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('points_per_currency_unit', 10, 4)->default(1); // points earned per 1 unit of currency spent
            $table->decimal('currency_per_point', 10, 4)->default(0.01); // value of 1 point in currency
            $table->integer('min_redeem_points')->default(100);
            $table->integer('point_expiry_days')->nullable(); // null = no expiry
            $table->json('tier_rules')->nullable(); // bronze, silver, gold tiers
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loyalty_programs');
    }
};
