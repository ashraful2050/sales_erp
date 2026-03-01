<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('account_id')->nullable()->constrained()->nullOnDelete();
            $table->string('code', 20)->nullable();
            $table->string('name');
            $table->string('name_bn')->nullable();
            $table->string('contact_person')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('mobile')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->default('Bangladesh');
            $table->string('tin_number')->nullable();
            $table->string('bin_number')->nullable();
            $table->string('currency_code', 3)->default('BDT');
            $table->decimal('credit_limit', 20, 4)->default(0);
            $table->integer('credit_days')->default(30);
            $table->decimal('opening_balance', 20, 4)->default(0);
            $table->enum('balance_type', ['debit', 'credit'])->default('debit');
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['company_id', 'code']);
        });

        Schema::create('vendors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('account_id')->nullable()->constrained()->nullOnDelete();
            $table->string('code', 20)->nullable();
            $table->string('name');
            $table->string('name_bn')->nullable();
            $table->string('contact_person')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('mobile')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->default('Bangladesh');
            $table->string('tin_number')->nullable();
            $table->string('bin_number')->nullable();
            $table->string('currency_code', 3)->default('BDT');
            $table->decimal('credit_limit', 20, 4)->default(0);
            $table->integer('credit_days')->default(30);
            $table->decimal('opening_balance', 20, 4)->default(0);
            $table->enum('balance_type', ['debit', 'credit'])->default('credit');
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['company_id', 'code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendors');
        Schema::dropIfExists('customers');
    }
};
