<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Company;
use App\Models\ExpenseCategory;

return new class extends Migration {
    public function up(): void
    {
        foreach (Company::pluck('id') as $companyId) {
            ExpenseCategory::seedDefaults($companyId);
        }
    }

    public function down(): void {}
};
