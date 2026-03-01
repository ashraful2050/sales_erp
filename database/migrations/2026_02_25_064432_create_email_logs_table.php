<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('email_logs', function (Blueprint $table) {
            $table->id();
            $table->string('mailable_class')->nullable();        // e.g. App\Mail\TenantApproved
            $table->string('subject')->nullable();
            $table->json('to')->nullable();                     // array of {address, name}
            $table->json('cc')->nullable();
            $table->json('bcc')->nullable();
            $table->string('from_address')->nullable();
            $table->string('from_name')->nullable();
            $table->enum('status', ['sent', 'failed'])->default('sent');
            $table->text('error_message')->nullable();           // filled on failure
            $table->json('context')->nullable();                 // extra data (e.g. company_id, user_id)
            $table->nullableMorphs('loggable');                  // polymorphic: linked record
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('mailable_class');
            $table->index('sent_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_logs');
    }
};
