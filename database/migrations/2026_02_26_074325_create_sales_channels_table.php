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
        Schema::create('sales_channels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('type'); // ecommerce, retail, b2b, mobile, social_facebook, social_instagram
            $table->string('platform')->nullable(); // WooCommerce, Shopify, Facebook, etc.
            $table->string('api_key')->nullable();
            $table->string('api_secret')->nullable();
            $table->string('webhook_url')->nullable();
            $table->json('settings')->nullable();
            $table->boolean('auto_sync')->default(true);
            $table->dateTime('last_sync_at')->nullable();
            $table->string('sync_status')->default('idle'); // idle, syncing, error
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales_channels');
    }
};
