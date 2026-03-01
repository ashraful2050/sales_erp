<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Account Types: Asset, Liability, Equity, Revenue, Expense
        Schema::create('account_groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('account_groups')->nullOnDelete();
            $table->string('name');
            $table->string('name_bn')->nullable();
            $table->enum('type', ['asset', 'liability', 'equity', 'revenue', 'expense']);
            $table->string('nature', 20)->default('debit'); // debit or credit
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('account_group_id')->constrained()->cascadeOnDelete();
            $table->string('code', 20)->nullable();
            $table->string('name');
            $table->string('name_bn')->nullable();
            $table->enum('type', ['asset', 'liability', 'equity', 'revenue', 'expense']);
            $table->string('sub_type')->nullable(); // cash, bank, receivable, payable, etc.
            $table->decimal('opening_balance', 20, 4)->default(0);
            $table->enum('balance_type', ['debit', 'credit'])->default('debit');
            $table->string('currency_code', 3)->default('BDT');
            $table->boolean('is_active')->default(true);
            $table->boolean('is_system')->default(false); // system accounts cannot be deleted
            $table->text('description')->nullable();
            $table->timestamps();
            $table->unique(['company_id', 'code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accounts');
        Schema::dropIfExists('account_groups');
    }
};
