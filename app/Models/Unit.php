<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class Unit extends Model {
    use LogsActivity;

    public function auditLabel(): string { return $this->name ?? '#' . $this->getKey(); }

    protected $fillable = ['company_id','name','abbreviation','is_active'];
    protected $casts = ['is_active' => 'boolean'];
    public function products() { return $this->hasMany(Product::class); }

    public static function seedDefaults(int $companyId): void
    {
        if (self::where('company_id', $companyId)->exists()) return;

        $defaults = [
            ['name' => 'Pieces',      'abbreviation' => 'pcs'],
            ['name' => 'Kilogram',    'abbreviation' => 'kg'],
            ['name' => 'Gram',        'abbreviation' => 'g'],
            ['name' => 'Litre',       'abbreviation' => 'ltr'],
            ['name' => 'Millilitre',  'abbreviation' => 'ml'],
            ['name' => 'Meter',       'abbreviation' => 'm'],
            ['name' => 'Centimeter',  'abbreviation' => 'cm'],
            ['name' => 'Box',         'abbreviation' => 'box'],
            ['name' => 'Dozen',       'abbreviation' => 'doz'],
            ['name' => 'Set',         'abbreviation' => 'set'],
            ['name' => 'Hour',        'abbreviation' => 'hr'],
            ['name' => 'Service',     'abbreviation' => 'svc'],
        ];

        foreach ($defaults as $unit) {
            self::create(array_merge($unit, ['company_id' => $companyId, 'is_active' => true]));
        }
    }
}
