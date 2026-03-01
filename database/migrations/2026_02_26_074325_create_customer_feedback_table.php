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
        Schema::create('customer_feedback', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $table->string('reference_type')->nullable(); // invoice, support_ticket
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->decimal('rating', 3, 1); // 1-5
            $table->string('category')->nullable(); // product, service, support, delivery
            $table->text('comment')->nullable();
            $table->string('sentiment')->nullable(); // positive, neutral, negative
            $table->string('source')->default('web'); // web, email, sms
            $table->boolean('is_public')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_feedback');
    }
};
