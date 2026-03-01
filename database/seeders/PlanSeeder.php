<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name'                   => 'Demo',
                'slug'                   => 'demo',
                'description'            => 'Try all features free for 24 hours. No credit card required.',
                'price_monthly'          => 0,
                'price_yearly'           => 0,
                'max_users'              => 2,
                'max_invoices_per_month' => 10,
                'max_products'           => 50,
                'max_employees'          => 5,
                'trial_days'             => 1,
                'features'               => ['accounting', 'sales', 'purchase', 'inventory'],
                'is_active'              => true,
                'sort_order'             => 0,
            ],
            [
                'name'                   => 'Starter',
                'slug'                   => 'starter',
                'description'            => 'Perfect for small businesses getting started.',
                'price_monthly'          => 19,
                'price_yearly'           => 190,
                'max_users'              => 3,
                'max_invoices_per_month' => 50,
                'max_products'           => 100,
                'max_employees'          => 10,
                'trial_days'             => 14,
                'features'               => ['accounting', 'sales', 'purchase', 'inventory'],
                'is_active'              => true,
                'sort_order'             => 1,
            ],
            [
                'name'                   => 'Business',
                'slug'                   => 'business',
                'description'            => 'Ideal for growing companies with more users.',
                'price_monthly'          => 49,
                'price_yearly'           => 490,
                'max_users'              => 10,
                'max_invoices_per_month' => 500,
                'max_products'           => 1000,
                'max_employees'          => 50,
                'trial_days'             => 14,
                'features'               => ['accounting', 'sales', 'purchase', 'inventory', 'hr', 'finance', 'assets', 'pos', 'reports'],
                'is_active'              => true,
                'sort_order'             => 2,
            ],
            [
                'name'                   => 'Enterprise',
                'slug'                   => 'enterprise',
                'description'            => 'Full-featured ERP for large organizations.',
                'price_monthly'          => 99,
                'price_yearly'           => 990,
                'max_users'              => 999,
                'max_invoices_per_month' => 99999,
                'max_products'           => 99999,
                'max_employees'          => 999,
                'trial_days'             => 30,
                'features'               => ['accounting', 'sales', 'purchase', 'inventory', 'hr', 'finance', 'assets', 'pos', 'reports', 'multi_warehouse', 'api_access'],
                'is_active'              => true,
                'sort_order'             => 3,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(['slug' => $plan['slug']], $plan);
        }

        $this->command->info('Plans seeded: Demo, Starter, Business, Enterprise');
    }
}
