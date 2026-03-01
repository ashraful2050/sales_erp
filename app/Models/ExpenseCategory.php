<?php
namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;

class ExpenseCategory extends Model
{
    use LogsActivity;

    public function auditLabel(): string { return $this->name ?? '#' . $this->getKey(); }

    protected $fillable = ['company_id', 'name', 'description', 'is_active'];

    public function expenses() { return $this->hasMany(Expense::class); }
    public function company()  { return $this->belongsTo(Company::class); }

    public static function seedDefaults(int $companyId): void
    {
        if (self::where('company_id', $companyId)->exists()) return;

        $defaults = [
            ['name' => 'Office Rent',           'description' => 'Monthly office / workspace rent'],
            ['name' => 'Utilities',              'description' => 'Electricity, water, gas bills'],
            ['name' => 'Internet & Telephone',   'description' => 'Internet, phone and communication costs'],
            ['name' => 'Salaries & Wages',       'description' => 'Employee payroll and wages'],
            ['name' => 'Office Supplies',        'description' => 'Stationery, consumables and office materials'],
            ['name' => 'Travel & Transport',     'description' => 'Fuel, vehicle hire and travel expenses'],
            ['name' => 'Maintenance & Repairs',  'description' => 'Equipment and facility maintenance'],
            ['name' => 'Food & Entertainment',   'description' => 'Staff meals, client entertainment'],
            ['name' => 'Advertising & Marketing','description' => 'Promotional and marketing expenses'],
            ['name' => 'Bank Charges',           'description' => 'Bank fees, transaction charges'],
            ['name' => 'Professional Fees',      'description' => 'Legal, audit, consultancy fees'],
            ['name' => 'Miscellaneous',          'description' => 'Other general expenses'],
        ];

        foreach ($defaults as $cat) {
            self::create(array_merge($cat, ['company_id' => $companyId, 'is_active' => true]));
        }
    }
}
