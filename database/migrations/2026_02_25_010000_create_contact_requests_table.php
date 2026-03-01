<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_requests', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('company_name');
            $table->string('company_size')->nullable(); // 1-10, 11-50, 51-200, 200+
            $table->string('industry')->nullable();
            $table->text('message')->nullable();
            $table->string('plan_interest')->nullable(); // which plan they're interested in
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('admin_notes')->nullable();
            $table->unsignedBigInteger('plan_id')->nullable(); // plan assigned when approving
            $table->string('admin_password_set')->nullable(); // temp password set for the new tenant admin
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->string('ip_address')->nullable();
            $table->timestamps();

            $table->foreign('plan_id')->references('id')->on('plans')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_requests');
    }
};
