<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('languages', function (Blueprint $table) {
            $table->id();
            $table->string('name');           // English, বাংলা
            $table->string('native_name')->nullable(); // English, বাংলা
            $table->string('code', 10)->unique(); // en, bn
            $table->string('flag', 10)->nullable();   // emoji flag e.g. 🇺🇸, 🇧🇩
            $table->boolean('is_rtl')->default(false);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_default')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('languages');
    }
};
