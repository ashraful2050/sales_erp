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
        Schema::create('discount_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('code')->nullable(); // coupon code
            $table->string('type'); // percentage, fixed, buy_x_get_y
            $table->decimal('value', 10, 4)->default(0);
            $table->decimal('max_discount_amount', 20, 4)->nullable();
            $table->decimal('min_order_amount', 20, 4)->nullable();
            $table->string('applies_to')->default('all'); // all, category, product, customer, segment
            $table->unsignedBigInteger('applies_to_id')->nullable();
            $table->integer('usage_limit')->nullable();
            $table->integer('usage_count')->default(0);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->boolean('requires_approval')->default(false);
            $table->string('status')->default('active'); // active, inactive, pending_approval
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discount_rules');
    }
};
