<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Employee;
use App\Models\Expense;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\PayrollPeriod;
use App\Models\PayrollRecord;
use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\Vendor;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Super admins have no company — redirect them to the super admin panel
        if (auth()->user()->isSuperAdmin()) {
            return redirect()->route('superadmin.dashboard');
        }

        $companyId = auth()->user()->company_id;

        // Key metrics
        $totalRevenue = Invoice::where('company_id', $companyId)
            ->where('type', 'sales')
            ->whereIn('status', ['paid', 'partial', 'sent'])
            ->whereMonth('invoice_date', now()->month)
            ->sum('total_amount');

        $totalReceivable = Invoice::where('company_id', $companyId)
            ->whereIn('status', ['sent', 'partial', 'overdue'])
            ->sum(DB::raw('total_amount - paid_amount'));

        $totalPayable = PurchaseOrder::where('company_id', $companyId)
            ->whereIn('status', ['received', 'partial', 'approved'])
            ->sum(DB::raw('total_amount - paid_amount'));

        $totalCustomers = Customer::where('company_id', $companyId)->where('is_active', true)->count();
        $totalVendors = Vendor::where('company_id', $companyId)->where('is_active', true)->count();
        $totalProducts = Product::where('company_id', $companyId)->where('is_active', true)->count();
        $totalEmployees = Employee::where('company_id', $companyId)->where('status', 'active')->count();

        // Monthly revenue chart (last 6 months)
        $monthlyRevenue = Invoice::where('company_id', $companyId)
            ->where('type', 'sales')
            ->whereIn('status', ['paid', 'partial', 'sent'])
            ->where('invoice_date', '>=', now()->subMonths(6)->startOfMonth())
            ->select(
                DB::raw('YEAR(invoice_date) as year'),
                DB::raw('MONTH(invoice_date) as month'),
                DB::raw('SUM(total_amount) as total')
            )
            ->groupBy('year', 'month')
            ->orderBy('year')->orderBy('month')
            ->get()
            ->map(fn($row) => [
                'month' => date('M Y', mktime(0, 0, 0, $row->month, 1, $row->year)),
                'revenue' => (float) $row->total,
            ]);

        // Monthly purchases chart (last 6 months)
        $monthlyPurchases = PurchaseOrder::where('company_id', $companyId)
            ->where('type', 'purchase')
            ->where('po_date', '>=', now()->subMonths(6)->startOfMonth())
            ->select(
                DB::raw('YEAR(po_date) as year'),
                DB::raw('MONTH(po_date) as month'),
                DB::raw('SUM(total_amount) as total')
            )
            ->groupBy('year', 'month')
            ->orderBy('year')->orderBy('month')
            ->get()
            ->map(fn($row) => [
                'month' => date('M Y', mktime(0, 0, 0, $row->month, 1, $row->year)),
                'purchases' => (float) $row->total,
            ]);

        // Recent invoices
        $recentInvoices = Invoice::where('company_id', $companyId)
            ->with('customer:id,name')
            ->latest()
            ->limit(5)
            ->get(['id', 'invoice_number', 'customer_id', 'total_amount', 'paid_amount', 'status', 'invoice_date']);

        // Overdue invoices count
        $overdueCount = Invoice::where('company_id', $companyId)
            ->where('due_date', '<', now())
            ->whereIn('status', ['sent', 'partial'])
            ->count();

        // Today's Sale Due — invoices with due_date = today and unpaid balance
        $todaySaleDue = Invoice::where('company_id', $companyId)
            ->whereDate('due_date', now()->toDateString())
            ->whereIn('status', ['sent', 'partial', 'overdue'])
            ->with('customer:id,name')
            ->orderBy('total_amount', 'desc')
            ->get(['id', 'invoice_number', 'customer_id', 'total_amount', 'paid_amount', 'status', 'due_date']);

        // Today's Purchase Due — POs with due_date = today and unpaid balance
        $todayPurchaseDue = PurchaseOrder::where('company_id', $companyId)
            ->whereDate('due_date', now()->toDateString())
            ->whereIn('status', ['approved', 'partial', 'received'])
            ->with('vendor:id,name')
            ->orderBy('total_amount', 'desc')
            ->get(['id', 'po_number', 'vendor_id', 'total_amount', 'paid_amount', 'status', 'due_date']);

        // Low stock products
        $lowStockProducts = Product::where('company_id', $companyId)
            ->where('track_inventory', true)
            ->where('is_active', true)
            ->with('stocks')
            ->get()
            ->filter(fn($p) => $p->total_stock <= $p->reorder_level && $p->reorder_level > 0)
            ->take(5)
            ->values();

        // ── Expense Statement (donut chart) ──────────────────────────────────
        // Accepts ?expense_month=2026-03 (YYYY-MM); defaults to current month
        $monthInput  = $request->query('expense_month', now()->format('Y-m'));
        [$esYear, $esMonth] = array_pad(explode('-', $monthInput), 2, now()->format('m'));
        $esYear  = (int) $esYear;
        $esMonth = (int) $esMonth;

        $expenseTotalSale = Invoice::where('company_id', $companyId)
            ->where('type', 'sales')
            ->whereYear('invoice_date', $esYear)
            ->whereMonth('invoice_date', $esMonth)
            ->sum('total_amount');

        $expenseTotalPurchase = PurchaseOrder::where('company_id', $companyId)
            ->whereYear('po_date', $esYear)
            ->whereMonth('po_date', $esMonth)
            ->sum('total_amount');

        $expenseTotalExpense = Expense::where('company_id', $companyId)
            ->whereYear('expense_date', $esYear)
            ->whereMonth('expense_date', $esMonth)
            ->sum('amount');

        // Employee salary: sum net_salary from payroll records whose period falls in the month
        $expenseEmployeeSalary = PayrollRecord::where('payroll_records.company_id', $companyId)
            ->join('payroll_periods', 'payroll_records.payroll_period_id', '=', 'payroll_periods.id')
            ->whereYear('payroll_periods.payment_date', $esYear)
            ->whereMonth('payroll_periods.payment_date', $esMonth)
            ->sum('payroll_records.net_salary');

        // Service: approved debit vouchers for the month
        $expenseService = Voucher::where('company_id', $companyId)
            ->where('voucher_type', 'debit')
            ->where('status', 'approved')
            ->whereYear('voucher_date', $esYear)
            ->whereMonth('voucher_date', $esMonth)
            ->sum('amount');

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalRevenue' => (float) $totalRevenue,
                'totalReceivable' => (float) $totalReceivable,
                'totalPayable' => (float) $totalPayable,
                'totalCustomers' => $totalCustomers,
                'totalVendors' => $totalVendors,
                'totalProducts' => $totalProducts,
                'totalEmployees' => $totalEmployees,
                'overdueCount' => $overdueCount,
            ],
            'monthlyRevenue' => $monthlyRevenue,
            'monthlyPurchases' => $monthlyPurchases,
            'recentInvoices' => $recentInvoices,
            'lowStockProducts' => $lowStockProducts,
            'todaySaleDue' => $todaySaleDue,
            'todayPurchaseDue' => $todayPurchaseDue,
            'expenseStatement' => [
                'month'           => $monthInput,
                'totalSale'       => (float) $expenseTotalSale,
                'totalPurchase'   => (float) $expenseTotalPurchase,
                'totalExpense'    => (float) $expenseTotalExpense,
                'employeeSalary'  => (float) $expenseEmployeeSalary,
                'service'         => (float) $expenseService,
            ],
        ]);
    }
}
