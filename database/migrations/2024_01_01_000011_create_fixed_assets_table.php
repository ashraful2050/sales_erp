<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::dropIfExists('asset_depreciations');
        Schema::dropIfExists('fixed_assets');
        Schema::dropIfExists('asset_categories');

        Schema::create('asset_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->decimal('useful_life_years', 8, 2)->default(5);
            $table->decimal('depreciation_rate', 8, 4)->default(20); // per year %
            $table->enum('depreciation_method', ['straight_line', 'declining_balance', 'sum_of_years'])->default('straight_line');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('fixed_assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('asset_category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('account_id')->nullable()->constrained()->nullOnDelete();
            $table->string('asset_code', 30)->nullable();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('serial_number')->nullable();
            $table->string('location')->nullable();
            $table->date('purchase_date');
            $table->decimal('purchase_cost', 20, 4);
            $table->decimal('salvage_value', 20, 4)->default(0);
            $table->decimal('useful_life_years', 8, 2);
            $table->decimal('depreciation_rate', 8, 4);
            $table->enum('depreciation_method', ['straight_line', 'declining_balance', 'sum_of_years'])->default('straight_line');
            $table->decimal('accumulated_depreciation', 20, 4)->default(0);
            $table->decimal('book_value', 20, 4)->default(0);
            $table->date('disposal_date')->nullable();
            $table->decimal('disposal_value', 20, 4)->nullable();
            $table->enum('status', ['active', 'disposed', 'written_off'])->default('active');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('asset_depreciations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fixed_asset_id')->constrained()->cascadeOnDelete();
            $table->foreignId('journal_entry_id')->nullable()->constrained()->nullOnDelete();
            $table->date('depreciation_date');
            $table->string('period_name');
            $table->decimal('depreciation_amount', 20, 4);
            $table->decimal('accumulated_depreciation', 20, 4);
            $table->decimal('book_value_after', 20, 4);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_depreciations');
        Schema::dropIfExists('fixed_assets');
        Schema::dropIfExists('asset_categories');
    }
};
