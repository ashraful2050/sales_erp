<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Extend the existing audit_logs with richer metadata columns
        Schema::table('audit_logs', function (Blueprint $table) {
            // Only add if not already present
            if (!Schema::hasColumn('audit_logs', 'user_name'))
                $table->string('user_name')->nullable()->after('user_id');
            if (!Schema::hasColumn('audit_logs', 'user_email'))
                $table->string('user_email')->nullable()->after('user_name');
            if (!Schema::hasColumn('audit_logs', 'module'))
                $table->string('module', 60)->nullable()->after('action');
            if (!Schema::hasColumn('audit_logs', 'auditable_label'))
                $table->string('auditable_label')->nullable()->after('module');
            if (!Schema::hasColumn('audit_logs', 'url'))
                $table->string('url', 2048)->nullable()->after('auditable_label');
            if (!Schema::hasColumn('audit_logs', 'event'))
                $table->string('event', 30)->nullable()->after('url');
        });
        
        // Create login_histories using a DUMMY echo — actual table created in migration 022
        // (this block intentionally empty — see migration 022)
    }

    public function down(): void
    {
        Schema::table('audit_logs', function (Blueprint $table) {
            $cols = ['user_name','user_email','module','auditable_label','url','event'];
            $existing = array_filter($cols, fn($c) => Schema::hasColumn('audit_logs', $c));
            if ($existing) $table->dropColumn(array_values($existing));
        });
    }
};
