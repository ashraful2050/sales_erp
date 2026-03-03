<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * LeaveTypeSeeder
 * Seeds standard leave types for each company.
 */
class LeaveTypeSeeder extends Seeder
{
    public function run(): void
    {
        // [name, allowed_days, is_paid]
        $leaveTypes = [
            ['Annual Leave',       20,  true],
            ['Sick Leave',         14,  true],
            ['Casual Leave',       10,  true],
            ['Maternity Leave',    112, true],
            ['Paternity Leave',    7,   true],
            ['Compensatory Leave', 5,   true],
            ['Study Leave',        10,  false],
            ['Unpaid Leave',       30,  false],
            ['Bereavement Leave',  5,   true],
            ['Quarantine Leave',   14,  true],
        ];

        $now    = now();
        $seeded = 0;
        $companies = Company::pluck('id');

        foreach ($companies as $companyId) {
            foreach ($leaveTypes as [$name, $days, $isPaid]) {
                $exists = DB::table('leave_types')
                    ->where('company_id', $companyId)
                    ->where('name', $name)
                    ->exists();

                if (! $exists) {
                    DB::table('leave_types')->insert([
                        'company_id'   => $companyId,
                        'name'         => $name,
                        'allowed_days' => $days,
                        'is_paid'      => $isPaid,
                        'is_active'    => true,
                        'created_at'   => $now,
                        'updated_at'   => $now,
                    ]);
                    $seeded++;
                }
            }
        }

        $this->command->info("LeaveTypeSeeder: {$seeded} leave types seeded.");
    }
}
