<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * CurrencySeeder
 * Seeds the global currencies table with major world currencies.
 * Idempotent – uses insertOrIgnore so it can be run multiple times safely.
 */
class CurrencySeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $currencies = [
            // ── Asia ────────────────────────────────────────────────────────
            ['code' => 'BDT', 'name' => 'Bangladeshi Taka',    'symbol' => '৳',  'exchange_rate' => 1.000000,   'is_active' => true],
            ['code' => 'INR', 'name' => 'Indian Rupee',        'symbol' => '₹',  'exchange_rate' => 1.230000,   'is_active' => true],
            ['code' => 'PKR', 'name' => 'Pakistani Rupee',     'symbol' => '₨',  'exchange_rate' => 0.370000,   'is_active' => true],
            ['code' => 'LKR', 'name' => 'Sri Lankan Rupee',    'symbol' => '₨',  'exchange_rate' => 0.340000,   'is_active' => true],
            ['code' => 'NPR', 'name' => 'Nepalese Rupee',      'symbol' => '₨',  'exchange_rate' => 0.780000,   'is_active' => true],
            ['code' => 'MMK', 'name' => 'Myanmar Kyat',        'symbol' => 'K',  'exchange_rate' => 0.047000,   'is_active' => true],
            ['code' => 'THB', 'name' => 'Thai Baht',           'symbol' => '฿',  'exchange_rate' => 2.900000,   'is_active' => true],
            ['code' => 'MYR', 'name' => 'Malaysian Ringgit',   'symbol' => 'RM', 'exchange_rate' => 22.500000,  'is_active' => true],
            ['code' => 'SGD', 'name' => 'Singapore Dollar',    'symbol' => 'S$', 'exchange_rate' => 74.000000,  'is_active' => true],
            ['code' => 'IDR', 'name' => 'Indonesian Rupiah',   'symbol' => 'Rp', 'exchange_rate' => 0.007000,   'is_active' => true],
            ['code' => 'PHP', 'name' => 'Philippine Peso',     'symbol' => '₱',  'exchange_rate' => 1.900000,   'is_active' => true],
            ['code' => 'VND', 'name' => 'Vietnamese Dong',     'symbol' => '₫',  'exchange_rate' => 0.004400,   'is_active' => true],
            ['code' => 'CNY', 'name' => 'Chinese Yuan',        'symbol' => '¥',  'exchange_rate' => 15.200000,  'is_active' => true],
            ['code' => 'JPY', 'name' => 'Japanese Yen',        'symbol' => '¥',  'exchange_rate' => 0.720000,   'is_active' => true],
            ['code' => 'KRW', 'name' => 'South Korean Won',    'symbol' => '₩',  'exchange_rate' => 0.080000,   'is_active' => true],
            ['code' => 'HKD', 'name' => 'Hong Kong Dollar',    'symbol' => 'HK$','exchange_rate' => 14.100000,  'is_active' => true],
            ['code' => 'TWD', 'name' => 'Taiwan Dollar',       'symbol' => 'NT$','exchange_rate' => 3.200000,   'is_active' => true],

            // ── Middle East ──────────────────────────────────────────────────
            ['code' => 'SAR', 'name' => 'Saudi Riyal',         'symbol' => '﷼',  'exchange_rate' => 29.300000,  'is_active' => true],
            ['code' => 'AED', 'name' => 'UAE Dirham',          'symbol' => 'د.إ','exchange_rate' => 30.000000,  'is_active' => true],
            ['code' => 'QAR', 'name' => 'Qatari Riyal',        'symbol' => 'ر.ق','exchange_rate' => 30.200000,  'is_active' => true],
            ['code' => 'KWD', 'name' => 'Kuwaiti Dinar',       'symbol' => 'د.ك','exchange_rate' => 360.000000, 'is_active' => true],
            ['code' => 'BHD', 'name' => 'Bahraini Dinar',      'symbol' => '.د.ب','exchange_rate' => 292.000000,'is_active' => true],
            ['code' => 'OMR', 'name' => 'Omani Rial',          'symbol' => '﷼',  'exchange_rate' => 286.000000, 'is_active' => true],
            ['code' => 'JOD', 'name' => 'Jordanian Dinar',     'symbol' => 'JD', 'exchange_rate' => 155.000000, 'is_active' => true],

            // ── Europe ───────────────────────────────────────────────────────
            ['code' => 'EUR', 'name' => 'Euro',                'symbol' => '€',  'exchange_rate' => 120.000000, 'is_active' => true],
            ['code' => 'GBP', 'name' => 'British Pound',       'symbol' => '£',  'exchange_rate' => 140.000000, 'is_active' => true],
            ['code' => 'CHF', 'name' => 'Swiss Franc',         'symbol' => 'Fr', 'exchange_rate' => 122.000000, 'is_active' => true],
            ['code' => 'SEK', 'name' => 'Swedish Krona',       'symbol' => 'kr', 'exchange_rate' => 9.500000,   'is_active' => true],
            ['code' => 'NOK', 'name' => 'Norwegian Krone',     'symbol' => 'kr', 'exchange_rate' => 9.800000,   'is_active' => true],
            ['code' => 'DKK', 'name' => 'Danish Krone',        'symbol' => 'kr', 'exchange_rate' => 16.200000,  'is_active' => true],
            ['code' => 'PLN', 'name' => 'Polish Zloty',        'symbol' => 'zł', 'exchange_rate' => 26.500000,  'is_active' => true],
            ['code' => 'CZK', 'name' => 'Czech Koruna',        'symbol' => 'Kč', 'exchange_rate' => 4.500000,   'is_active' => true],
            ['code' => 'HUF', 'name' => 'Hungarian Forint',    'symbol' => 'Ft', 'exchange_rate' => 0.290000,   'is_active' => true],
            ['code' => 'TRY', 'name' => 'Turkish Lira',        'symbol' => '₺',  'exchange_rate' => 3.400000,   'is_active' => true],
            ['code' => 'RUB', 'name' => 'Russian Ruble',       'symbol' => '₽',  'exchange_rate' => 1.200000,   'is_active' => true],

            // ── Americas ─────────────────────────────────────────────────────
            ['code' => 'USD', 'name' => 'US Dollar',           'symbol' => '$',  'exchange_rate' => 110.000000, 'is_active' => true],
            ['code' => 'CAD', 'name' => 'Canadian Dollar',     'symbol' => 'CA$','exchange_rate' => 79.000000,  'is_active' => true],
            ['code' => 'MXN', 'name' => 'Mexican Peso',        'symbol' => '$',  'exchange_rate' => 5.800000,   'is_active' => true],
            ['code' => 'BRL', 'name' => 'Brazilian Real',      'symbol' => 'R$', 'exchange_rate' => 21.000000,  'is_active' => true],
            ['code' => 'ARS', 'name' => 'Argentine Peso',      'symbol' => '$',  'exchange_rate' => 0.120000,   'is_active' => true],
            ['code' => 'CLP', 'name' => 'Chilean Peso',        'symbol' => '$',  'exchange_rate' => 0.120000,   'is_active' => true],
            ['code' => 'COP', 'name' => 'Colombian Peso',      'symbol' => '$',  'exchange_rate' => 0.027000,   'is_active' => true],

            // ── Africa & Oceania ─────────────────────────────────────────────
            ['code' => 'ZAR', 'name' => 'South African Rand',  'symbol' => 'R',  'exchange_rate' => 5.900000,   'is_active' => true],
            ['code' => 'NGN', 'name' => 'Nigerian Naira',      'symbol' => '₦',  'exchange_rate' => 0.072000,   'is_active' => true],
            ['code' => 'KES', 'name' => 'Kenyan Shilling',     'symbol' => 'KSh','exchange_rate' => 0.830000,   'is_active' => true],
            ['code' => 'EGP', 'name' => 'Egyptian Pound',      'symbol' => '£',  'exchange_rate' => 2.900000,   'is_active' => true],
            ['code' => 'GHS', 'name' => 'Ghanaian Cedi',       'symbol' => '₵',  'exchange_rate' => 7.400000,   'is_active' => true],
            ['code' => 'AUD', 'name' => 'Australian Dollar',   'symbol' => 'A$', 'exchange_rate' => 70.000000,  'is_active' => true],
            ['code' => 'NZD', 'name' => 'New Zealand Dollar',  'symbol' => 'NZ$','exchange_rate' => 64.000000,  'is_active' => true],
        ];

        foreach ($currencies as $currency) {
            DB::table('currencies')->insertOrIgnore(array_merge($currency, [
                'created_at' => $now,
                'updated_at' => $now,
            ]));
        }

        $this->command->info('Currencies seeded: ' . count($currencies) . ' records.');
    }
}
