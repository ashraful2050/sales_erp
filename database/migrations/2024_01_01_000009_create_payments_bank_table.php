<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('bank_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('account_id')->constrained()->cascadeOnDelete(); // GL account
            $table->string('bank_name');
            $table->string('account_name');
            $table->string('account_number', 50);
            $table->string('branch_name')->nullable();
            $table->string('routing_number')->nullable();
            $table->string('swift_code')->nullable();
            $table->string('currency_code', 3)->default('BDT');
            $table->decimal('opening_balance', 20, 4)->default(0);
            $table->enum('payment_method', ['cash', 'bank', 'bkash', 'nagad', 'rocket', 'upay', 'other'])->default('bank');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('journal_entry_id')->nullable()->constrained()->nullOnDelete();
            $table->string('payment_number', 50)->unique();
            $table->enum('type', ['received', 'made'])->default('received'); // received=customer, made=vendor
            $table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('vendor_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('bank_account_id')->nullable()->constrained()->nullOnDelete();
            $table->date('payment_date');
            $table->decimal('amount', 20, 4);
            $table->string('currency_code', 3)->default('BDT');
            $table->decimal('exchange_rate', 15, 6)->default(1.000000);
            $table->enum('payment_method', ['cash', 'bank', 'bkash', 'nagad', 'rocket', 'upay', 'cheque', 'other'])->default('cash');
            $table->string('reference')->nullable(); // cheque number, transaction ID
            $table->text('notes')->nullable();
            $table->enum('status', ['draft', 'confirmed', 'void'])->default('confirmed');
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('payment_allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_id')->constrained()->cascadeOnDelete();
            $table->string('reference_type'); // invoice, purchase_order
            $table->unsignedBigInteger('reference_id');
            $table->decimal('allocated_amount', 20, 4);
            $table->timestamps();
            $table->index(['reference_type', 'reference_id']);
        });

        Schema::create('bank_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('bank_account_id')->constrained()->cascadeOnDelete();
            $table->date('transaction_date');
            $table->string('description');
            $table->decimal('debit', 20, 4)->default(0);
            $table->decimal('credit', 20, 4)->default(0);
            $table->decimal('balance', 20, 4)->default(0);
            $table->string('reference')->nullable();
            $table->boolean('is_reconciled')->default(false);
            $table->date('reconciled_date')->nullable();
            $table->foreignId('journal_entry_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bank_transactions');
        Schema::dropIfExists('payment_allocations');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('bank_accounts');
    }
};
