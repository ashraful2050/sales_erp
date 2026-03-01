<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('company_id');
            $table->string('name');                          // e.g. "Main Cash", "BRAC Bank"
            $table->enum('type', ['cash', 'bank', 'mobile_banking', 'other'])->default('cash');
            $table->unsignedBigInteger('account_id')->nullable(); // linked GL account
            $table->boolean('is_default')->default(false);
            $table->boolean('is_active')->default(true);
            $table->string('notes')->nullable();
            $table->timestamps();

            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->foreign('account_id')->references('id')->on('accounts')->onDelete('set null');
        });
    }

    public function down(): void {
        Schema::dropIfExists('payment_methods');
    }
};
