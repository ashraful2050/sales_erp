<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['code' => 'PRD-001', 'name' => 'Laptop Computer',           'type' => 'product', 'cost_price' => 55000, 'sale_price' => 65000, 'tax_rate_id' => 13],
            ['code' => 'PRD-002', 'name' => 'Desktop Computer',          'type' => 'product', 'cost_price' => 35000, 'sale_price' => 45000, 'tax_rate_id' => 13],
            ['code' => 'PRD-003', 'name' => 'Laser Printer',             'type' => 'product', 'cost_price' => 15000, 'sale_price' => 20000, 'tax_rate_id' => 13],
            ['code' => 'PRD-004', 'name' => 'UPS 1200VA',                'type' => 'product', 'cost_price' =>  5500, 'sale_price' =>  7500, 'tax_rate_id' => 14],
            ['code' => 'PRD-005', 'name' => 'Office Chair',              'type' => 'product', 'cost_price' =>  3500, 'sale_price' =>  5000, 'tax_rate_id' => 14],
            ['code' => 'PRD-006', 'name' => 'Office Desk',               'type' => 'product', 'cost_price' =>  8000, 'sale_price' => 12000, 'tax_rate_id' => 14],
            ['code' => 'PRD-007', 'name' => 'A4 Paper (Ream)',           'type' => 'product', 'cost_price' =>   350, 'sale_price' =>   450, 'tax_rate_id' => 15],
            ['code' => 'PRD-008', 'name' => 'Printer Toner Cartridge',   'type' => 'product', 'cost_price' =>  2500, 'sale_price' =>  3500, 'tax_rate_id' => 13],
            ['code' => 'PRD-009', 'name' => 'Software Development (hr)', 'type' => 'service', 'cost_price' =>   800, 'sale_price' =>  1500, 'tax_rate_id' => 15],
            ['code' => 'PRD-010', 'name' => 'IT Support Service (hr)',   'type' => 'service', 'cost_price' =>   500, 'sale_price' =>  1000, 'tax_rate_id' => 15],
            ['code' => 'PRD-011', 'name' => 'Network Setup Service',     'type' => 'service', 'cost_price' =>  5000, 'sale_price' => 10000, 'tax_rate_id' => 15],
            ['code' => 'PRD-012', 'name' => 'Annual Maintenance Contract','type' => 'service','cost_price' => 20000, 'sale_price' => 35000, 'tax_rate_id' => 15],
            ['code' => 'PRD-013', 'name' => 'USB Flash Drive 64GB',      'type' => 'product', 'cost_price' =>   400, 'sale_price' =>   650, 'tax_rate_id' => 13],
            ['code' => 'PRD-014', 'name' => 'Wireless Mouse',            'type' => 'product', 'cost_price' =>   600, 'sale_price' =>   900, 'tax_rate_id' => 13],
            ['code' => 'PRD-015', 'name' => 'Mechanical Keyboard',       'type' => 'product', 'cost_price' =>  1800, 'sale_price' =>  2800, 'tax_rate_id' => 13],
        ];

        foreach ($products as $p) {
            Product::firstOrCreate(
                ['code' => $p['code'], 'company_id' => 3],
                array_merge($p, [
                    'company_id'       => 3,
                    'category_id'      => 1,
                    'unit_id'          => 17,
                    'is_active'        => true,
                    'track_inventory'  => false,
                    'min_sale_price'   => $p['cost_price'],
                    'reorder_level'    => 10,
                    'reorder_quantity' => 50,
                ])
            );
        }

        $this->command->info('✓ 15 products seeded successfully.');
    }
}
