<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('translations', function (Blueprint $table) {
            $table->id();
            $table->string('language_code', 10)->index();
            $table->string('group')->default('ui'); // ui, nav, messages, etc.
            $table->string('key');                  // e.g. dashboard, save, cancel
            $table->text('value');
            $table->timestamps();

            $table->unique(['language_code', 'group', 'key']);
            $table->foreign('language_code')->references('code')->on('languages')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('translations');
    }
};
