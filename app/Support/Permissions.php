<?php

namespace App\Support;

class Permissions
{
    /**
     * All modules and their allowed actions.
     * superadmin bypasses all checks.
     */
    public const MODULES = [
        'accounting'     => ['view', 'create', 'edit', 'delete'],
        'sales'          => ['view', 'create', 'edit', 'delete'],
        'purchase'       => ['view', 'create', 'edit', 'delete'],
        'finance'        => ['view', 'create', 'edit', 'delete'],
        'inventory'      => ['view', 'create', 'edit', 'delete'],
        'hr'             => ['view', 'create', 'edit', 'delete'],
        'assets'         => ['view', 'create', 'edit', 'delete'],
        'pos'            => ['view', 'create'],
        'reports'        => ['view'],
        'settings'       => ['view', 'edit'],
        'users'          => ['view', 'create', 'edit', 'delete'],
        'faq'            => ['view'],
        'crm'            => ['view', 'create', 'edit', 'delete'],
        'tasks'          => ['view', 'create', 'edit', 'delete'],
        'support'        => ['view', 'create', 'edit', 'delete'],
        'analytics'      => ['view'],
        'ie'             => ['view'],
    ];

    /**
     * Granular feature-level permissions per module.
     * Keys become permission strings like "reports.trial_balance".
     */
    public const FEATURES = [
        'reports' => [
            'trial_balance'      => 'Trial Balance',
            'profit_loss'        => 'Profit & Loss',
            'balance_sheet'      => 'Balance Sheet',
            'cash_flow'          => 'Cash Flow Statement',
            'income_statement'   => 'Income Statement',
            'general_ledger'     => 'General Ledger',
            'aged_receivables'   => 'Aged Receivables',
            'aged_payables'      => 'Aged Payables',
            'sales_report'       => 'Sales Report',
            'purchase_report'    => 'Purchase Report',
            'stock_report'       => 'Stock Report',
            'customer_statement' => 'Customer Statement',
            'vendor_statement'   => 'Vendor Statement',
            'expense_report'     => 'Expense Report',
            'tax_report'         => 'Tax Report',
            'payroll_summary'    => 'Payroll Summary',
            'asset_register'     => 'Asset Register',
        ],
        'accounting' => [
            'chart_of_accounts' => 'Chart of Accounts',
            'account_groups'    => 'Account Groups',
            'journal_entries'   => 'Journal Entries',
            'opening_balance'   => 'Opening Balance',
            'payment_methods'   => 'Payment Methods',
            'debit_vouchers'    => 'Debit Vouchers',
            'credit_vouchers'   => 'Credit Vouchers',
            'contra_vouchers'   => 'Contra Vouchers',
            'service_payment'   => 'Service Payment',
            'cash_adjustment'   => 'Cash Adjustment',
            'voucher_approval'  => 'Voucher Approval',
        ],
        'sales' => [
            'invoices'         => 'Invoices',
            'quotations'       => 'Quotations',
            'credit_notes'     => 'Credit Notes',
            'delivery_notes'   => 'Delivery Notes',
            'customers'        => 'Customers',
            'pricing_rules'    => 'Pricing Rules',
            'discount_rules'   => 'Discounts & Coupons',
            'loyalty_programs' => 'Loyalty Programs',
            'commissions'      => 'Commission Management',
            'sales_channels'   => 'Sales Channels',
        ],
        'crm' => [
            'leads'    => 'Lead Management',
            'segments' => 'Customer Segments',
        ],
        'tasks' => [
            'task_management' => 'Task Management',
        ],
        'support' => [
            'tickets' => 'Support Tickets',
        ],
        'analytics' => [
            'sales_dashboard'    => 'Sales Dashboard',
            'customer_feedback'  => 'Customer Feedback',
        ],
        'purchase' => [
            'purchase_orders' => 'Purchase Orders',
            'vendors'         => 'Vendors',
            'debit_notes'     => 'Debit Notes',
            'goods_receipts'  => 'Goods Receipts (GRN)',
        ],
        'finance' => [
            'payments'      => 'Payments',
            'bank_accounts' => 'Bank Accounts',
            'expenses'      => 'Expenses',
        ],
        'inventory' => [
            'products'        => 'Products',
            'warehouses'      => 'Warehouses',
            'categories'      => 'Categories',
            'stock_movements' => 'Stock Movements',
        ],
        'hr' => [
            'employees' => 'Employees',
            'payroll'   => 'Payroll',
            'leaves'    => 'Leave Management',
        ],
        'assets' => [
            'fixed_assets' => 'Fixed Assets',
            'depreciation' => 'Depreciation',
        ],
        'pos' => [
            'pos_terminal' => 'POS Terminal',
            'pos_reports'  => 'POS Reports',
        ],
        'settings' => [
            'company_settings' => 'Company Settings',
            'tax_rates'        => 'Tax Rates',
            'currencies'       => 'Currencies',
            'fiscal_years'     => 'Fiscal Years',
            'units'            => 'Units of Measure',
        ],
        'ie' => [
            'process_optimization'   => 'Process Optimization',
            'workload_balancing'     => 'Workload Balancing',
            'kpi_analytics'          => 'KPI & Performance Analytics',
            'demand_forecasting'     => 'Demand Forecasting',
            'order_fulfillment'      => 'Order Fulfillment',
            'standardization'        => 'Standardization & Automation',
            'waste_dashboard'        => 'Waste Dashboard (Lean)',
            'cost_to_serve'          => 'Cost-to-Serve Analysis',
            'simulation'             => 'Simulation & What-If',
            'continuous_improvement' => 'Continuous Improvement',
        ],
    ];

    /** Return flat list of every permission key (modules + features) */
    public static function all(): array
    {
        $list = [];
        foreach (self::MODULES as $module => $actions) {
            foreach ($actions as $action) {
                $list[] = "{$module}.{$action}";
            }
        }
        foreach (self::FEATURES as $module => $features) {
            foreach ($features as $feature => $label) {
                $list[] = "{$module}.{$feature}";
            }
        }
        return $list;
    }

    /** Default permissions for the 'admin' role — everything except user deletion */
    public static function adminDefaults(): array
    {
        $perms = [];
        foreach (self::MODULES as $module => $actions) {
            foreach ($actions as $action) {
                $perms["{$module}.{$action}"] = !($module === 'users' && $action === 'delete');
            }
        }
        // Admin gets all feature permissions
        foreach (self::FEATURES as $module => $features) {
            foreach ($features as $feature => $label) {
                $perms["{$module}.{$feature}"] = true;
            }
        }
        return $perms;
    }

    /** Default permissions for the 'moderator' role — view + create only */
    public static function moderatorDefaults(): array
    {
        $perms = [];
        foreach (self::MODULES as $module => $actions) {
            foreach ($actions as $action) {
                $perms["{$module}.{$action}"] = in_array($action, ['view', 'create']);
            }
        }
        // moderator cannot manage users/settings at all
        foreach (['users', 'settings'] as $restricted) {
            foreach (self::MODULES[$restricted] as $action) {
                $perms["{$restricted}.{$action}"] = false;
            }
        }
        // Moderator: grant view-oriented features, deny settings/users features
        foreach (self::FEATURES as $module => $features) {
            foreach ($features as $feature => $label) {
                $perms["{$module}.{$feature}"] = !in_array($module, ['settings', 'users']);
            }
        }
        // Moderator: restrict delete on sensitive new modules
        foreach (['crm', 'tasks', 'support', 'analytics'] as $module) {
            if (isset(self::MODULES[$module]) && in_array('delete', self::MODULES[$module])) {
                $perms["{$module}.delete"] = false;
            }
        }
        return $perms;
    }

    /** Return module labels for UI display */
    public static function moduleLabels(): array
    {
        return [
            'accounting' => 'Accounting',
            'sales'      => 'Sales',
            'purchase'   => 'Purchase',
            'finance'    => 'Finance',
            'inventory'  => 'Inventory',
            'hr'         => 'HR & Payroll',
            'assets'     => 'Fixed Assets',
            'pos'        => 'POS (Point of Sale)',
            'reports'    => 'Reports',
            'settings'   => 'Settings',
            'users'      => 'User Management',
            'faq'        => 'Knowledge Base',
            'crm'        => 'CRM',
            'tasks'      => 'Task Management',
            'support'    => 'Customer Support',
            'analytics'  => 'Analytics & AI',
            'ie'         => 'Industrial Engineering',
        ];
    }

    /** Return feature labels grouped by module, for UI display */
    public static function featureLabels(): array
    {
        return self::FEATURES;
    }

    /** Icons for each module (used by frontend) */
    public static function moduleIcons(): array
    {
        return [
            'reports'    => '📊',
            'accounting' => '📒',
            'sales'      => '🛒',
            'purchase'   => '📦',
            'finance'    => '💳',
            'inventory'  => '🏪',
            'hr'         => '👥',
            'assets'     => '🏭',
            'pos'        => '🖥️',
            'settings'   => '⚙️',
            'crm'        => '🤝',
            'tasks'      => '✅',
            'support'    => '🎧',
            'analytics'  => '🧠',
            'ie'         => '🏭',
        ];
    }
}
