<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('company_id');
            $table->string('voucher_number')->unique();
            $table->enum('voucher_type', ['debit', 'credit', 'contra', 'service', 'cash_adjustment']);
            $table->date('voucher_date');
            // Payment side (cash/bank account)
            $table->unsignedBigInteger('payment_method_id')->nullable();   // for debit/credit/service/adjustment
            $table->unsignedBigInteger('from_payment_method_id')->nullable(); // for contra (source)
            $table->unsignedBigInteger('to_payment_method_id')->nullable();   // for contra (dest)
            // Account side (what is debited/credited)
            $table->unsignedBigInteger('account_id')->nullable();  // expense/income/receivable/payable
            $table->decimal('amount', 15, 2)->default(0);
            $table->string('narration')->nullable();
            $table->string('reference')->nullable();
            $table->enum('status', ['draft', 'pending', 'approved', 'rejected'])->default('draft');
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->string('rejection_reason')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            // Link to generated journal entry
            $table->unsignedBigInteger('journal_entry_id')->nullable();
            $table->timestamps();

            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->foreign('payment_method_id')->references('id')->on('payment_methods')->onDelete('set null');
            $table->foreign('from_payment_method_id')->references('id')->on('payment_methods')->onDelete('set null');
            $table->foreign('to_payment_method_id')->references('id')->on('payment_methods')->onDelete('set null');
            $table->foreign('account_id')->references('id')->on('accounts')->onDelete('set null');
            $table->foreign('approved_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void {
        Schema::dropIfExists('vouchers');
    }
};
