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
        Schema::create('sales_forecasts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('period'); // YYYY-MM
            $table->string('type')->default('revenue'); // revenue, units, leads
            $table->decimal('forecasted_value', 20, 4);
            $table->decimal('actual_value', 20, 4)->nullable();
            $table->decimal('confidence_score', 5, 2)->nullable(); // 0-100
            $table->string('method')->default('moving_average'); // moving_average, linear_regression, weighted
            $table->json('model_data')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales_forecasts');
    }
};
