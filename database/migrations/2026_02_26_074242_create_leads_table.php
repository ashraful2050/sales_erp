<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('contact_name')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('company_name')->nullable();
            $table->string('source')->nullable(); // website, social_media, referral, cold_call, email
            $table->string('status')->default('new'); // new, contacted, qualified, proposal, negotiation, won, lost
            $table->string('priority')->default('medium'); // low, medium, high
            $table->decimal('estimated_value', 20, 4)->default(0);
            $table->decimal('score', 5, 2)->default(0); // AI lead score 0-100
            $table->string('industry')->nullable();
            $table->text('notes')->nullable();
            $table->date('expected_close_date')->nullable();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
