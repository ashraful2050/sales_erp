<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->string('slug')->unique()->nullable()->after('name');
            $table->enum('status', ['active', 'suspended', 'pending', 'cancelled'])->default('active')->after('settings');
            $table->boolean('is_verified')->default(false)->after('status');
            $table->string('timezone')->default('Asia/Dhaka')->after('is_verified');
            $table->string('date_format')->default('d/m/Y')->after('timezone');
            $table->unsignedBigInteger('primary_user_id')->nullable()->after('date_format'); // the owner/admin
            $table->timestamp('last_active_at')->nullable()->after('primary_user_id');
            $table->text('suspension_reason')->nullable()->after('last_active_at');
        });

        // Users table — add is_superadmin flag to differentiate global superadmins
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_superadmin')->default(false)->after('role');
        });
    }

    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn(['slug', 'status', 'is_verified', 'timezone', 'date_format',
                'primary_user_id', 'last_active_at', 'suspension_reason']);
        });
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_superadmin');
        });
    }
};
