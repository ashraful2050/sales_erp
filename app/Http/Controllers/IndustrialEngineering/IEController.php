<?php

namespace App\Http\Controllers\IndustrialEngineering;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Customer;
use App\Models\Lead;
use App\Models\Employee;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class IEController extends Controller
{
    private function cid(): int
    {
        return auth()->user()->company_id;
    }

    // ─── 1. Sales Process Optimization ───────────────────────────────────
    public function processOptimization()
    {
        $cid = $this->cid();

        // Order cycle time: days from invoice_date to updated_at (payment event proxy)
        $cycleData = Invoice::where('company_id', $cid)
            ->where('type', 'sales')
            ->where('status', 'paid')
            ->selectRaw('ROUND(AVG(DATEDIFF(updated_at, invoice_date)),1) as avg_days, MIN(DATEDIFF(updated_at, invoice_date)) as min_days, MAX(DATEDIFF(updated_at, invoice_date)) as max_days, COUNT(*) as total')
            ->first();

        // Monthly cycle times for trend
        $cycleTrend = Invoice::where('company_id', $cid)
            ->where('type', 'sales')
            ->where('status', 'paid')
            ->whereRaw("invoice_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)")
            ->selectRaw("DATE_FORMAT(invoice_date,'%b %Y') as month, ROUND(AVG(DATEDIFF(updated_at, invoice_date)),1) as avg_days")
            ->groupByRaw("DATE_FORMAT(invoice_date,'%Y-%m'), DATE_FORMAT(invoice_date,'%b %Y')")
            ->orderByRaw("DATE_FORMAT(invoice_date,'%Y-%m')")
            ->get();

        // Status distribution (process stages)
        $statusDist = Invoice::where('company_id', $cid)
            ->where('type', 'sales')
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get();

        // SLA: invoices overdue > 30 days
        $slaBreaches = Invoice::where('company_id', $cid)
            ->where('type', 'sales')
            ->where('status', 'sent')
            ->whereRaw('due_date < CURDATE()')
            ->count();

        $totalOpen = Invoice::where('company_id', $cid)
            ->where('type', 'sales')
            ->whereIn('status', ['sent', 'partial'])
            ->count();

        $slaCompliance = $totalOpen > 0 ? round((($totalOpen - $slaBreaches) / $totalOpen) * 100, 1) : 100;

        // Quotation to order conversion: quotations with status 'paid'/'sent' vs total
        $totalQuotes  = Invoice::where('company_id', $cid)->where('type', 'quotation')->count();
        $convertedQt  = Invoice::where('company_id', $cid)->where('type', 'sales')->count(); // sales = converted from quotes (rough)
        $quoteConv    = $totalQuotes > 0 ? min(100, round(($convertedQt / ($totalQuotes + $convertedQt)) * 100, 1)) : 0;

        return Inertia::render('IndustrialEngineering/ProcessOptimization', [
            'cycleData'      => $cycleData,
            'cycleTrend'     => $cycleTrend,
            'statusDist'     => $statusDist,
            'slaBreaches'    => $slaBreaches,
            'slaCompliance'  => $slaCompliance,
            'totalOpen'      => $totalOpen,
            'quoteConversion'=> $quoteConv,
            'totalQuotes'    => $totalQuotes,
        ]);
    }

    // ─── 2. Workload Balancing ────────────────────────────────────────────
    public function workloadBalancing()
    {
        $cid = $this->cid();

        // Sales rep workload: invoices per rep (using created_by)
        $repWorkload = Invoice::where('company_id', $cid)
            ->where('type', 'sales')
            ->whereRaw("invoice_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)")
            ->selectRaw('created_by, COUNT(*) as invoice_count, SUM(total_amount) as total_value')
            ->groupBy('created_by')
            ->with('createdBy:id,name')
            ->get()
            ->map(fn($r) => [
                'rep'   => optional($r->createdBy)->name ?? 'User #'.$r->created_by,
                'count' => $r->invoice_count,
                'value' => round($r->total_value, 2),
            ]);

        // Lead distribution
        $leadDist = Lead::where('company_id', $cid)
            ->selectRaw('assigned_to, COUNT(*) as lead_count, SUM(CASE WHEN status="won" THEN 1 ELSE 0 END) as won')
            ->groupBy('assigned_to')
            ->with('assignedTo:id,name')
            ->get()
            ->map(fn($r) => [
                'rep'   => optional($r->assignedTo)->name ?? 'User #'.$r->assigned_to,
                'leads' => $r->lead_count,
                'won'   => $r->won,
            ]);

        // Monthly lead volume for capacity
        $leadVolume = Lead::where('company_id', $cid)
            ->whereRaw("created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)")
            ->selectRaw("DATE_FORMAT(created_at,'%b %Y') as month, COUNT(*) as count")
            ->groupByRaw("DATE_FORMAT(created_at,'%Y-%m'), DATE_FORMAT(created_at,'%b %Y')")
            ->orderByRaw("DATE_FORMAT(created_at,'%Y-%m')")
            ->get();

        return Inertia::render('IndustrialEngineering/WorkloadBalancing', [
            'repWorkload' => $repWorkload,
            'leadDist'    => $leadDist,
            'leadVolume'  => $leadVolume,
        ]);
    }

    // ─── 3. KPI & Performance Analytics ─────────────────────────────────
    public function kpiAnalytics()
    {
        $cid = $this->cid();

        $totalInvoices = Invoice::where('company_id', $cid)->where('type', 'sales')->count();
        $totalRevenue  = (float) Invoice::where('company_id', $cid)->where('type', 'sales')->whereIn('status', ['paid', 'partial'])->sum('total_amount');
        $totalCost     = $totalRevenue * 0.65;  // estimated cost at 65% of revenue (replace with actual cost column if available)
        $avgOrderValue = $totalInvoices > 0 ? round($totalRevenue / $totalInvoices, 2) : 0;
        $grossMargin   = $totalRevenue > 0 ? round((($totalRevenue - $totalCost) / $totalRevenue) * 100, 1) : 0;

        $totalLeads    = Lead::where('company_id', $cid)->count();
        $wonLeads      = Lead::where('company_id', $cid)->where('status', 'won')->count();
        $convRate      = $totalLeads > 0 ? round(($wonLeads / $totalLeads) * 100, 1) : 0;

        $totalCustomers = Customer::where('company_id', $cid)->count();
        $revenuePerCustomer = $totalCustomers > 0 ? round($totalRevenue / $totalCustomers, 2) : 0;

        // Monthly revenue + margin trend
        $monthlyTrend = Invoice::where('company_id', $cid)
            ->where('type', 'sales')
            ->whereIn('status', ['paid', 'partial'])
            ->whereRaw("invoice_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)")
            ->selectRaw("DATE_FORMAT(invoice_date,'%b %Y') as month, ROUND(SUM(total_amount),2) as revenue, ROUND(SUM(total_amount)*0.35,2) as profit")
            ->groupByRaw("DATE_FORMAT(invoice_date,'%Y-%m'), DATE_FORMAT(invoice_date,'%b %Y')")
            ->orderByRaw("DATE_FORMAT(invoice_date,'%Y-%m')")
            ->get();

        // Top 10 products by revenue
        $topProducts = InvoiceItem::whereHas('invoice', fn($q) => $q->where('company_id', $cid)->where('type', 'sales')->whereIn('status', ['paid', 'partial']))
            ->selectRaw('product_id, SUM(total) as revenue, SUM(quantity) as qty, COUNT(DISTINCT invoice_id) as orders')
            ->groupBy('product_id')
            ->orderByDesc('revenue')
            ->limit(10)
            ->with('product:id,name')
            ->get()
            ->map(fn($r) => [
                'product' => optional($r->product)->name ?? 'Product #'.$r->product_id,
                'revenue' => round($r->revenue, 2),
                'qty'     => $r->qty,
                'orders'  => $r->orders,
            ]);

        return Inertia::render('IndustrialEngineering/KPIAnalytics', [
            'kpis' => [
                'totalRevenue'       => round($totalRevenue, 2),
                'totalInvoices'      => $totalInvoices,
                'avgOrderValue'      => $avgOrderValue,
                'grossMargin'        => $grossMargin,
                'conversionRate'     => $convRate,
                'revenuePerCustomer' => $revenuePerCustomer,
                'totalCustomers'     => $totalCustomers,
                'wonLeads'           => $wonLeads,
            ],
            'monthlyTrend' => $monthlyTrend,
            'topProducts'  => $topProducts,
        ]);
    }

    // ─── 4. Demand Forecasting ────────────────────────────────────────────
    public function demandForecasting()
    {
        $cid = $this->cid();

        // Historical monthly revenue (24 months)
        $historical = Invoice::where('company_id', $cid)
            ->where('type', 'sales')
            ->whereIn('status', ['paid', 'partial', 'sent'])
            ->whereRaw("invoice_date >= DATE_SUB(NOW(), INTERVAL 24 MONTH)")
            ->selectRaw("DATE_FORMAT(invoice_date,'%Y-%m') as period, DATE_FORMAT(invoice_date,'%b %Y') as label, ROUND(SUM(total_amount),2) as revenue, COUNT(*) as orders")
            ->groupByRaw("DATE_FORMAT(invoice_date,'%Y-%m'), DATE_FORMAT(invoice_date,'%b %Y')")
            ->orderByRaw("DATE_FORMAT(invoice_date,'%Y-%m')")
            ->get();

        // Simple 3-month moving average forecast for next 3 months
        $revenues  = $historical->pluck('revenue')->values()->toArray();
        $n         = count($revenues);
        $forecast  = [];
        if ($n >= 3) {
            for ($i = 1; $i <= 3; $i++) {
                $avg = array_sum(array_slice($revenues, -3)) / 3;
                $revenues[] = $avg;
                $forecast[] = [
                    'label'   => now()->addMonths($i)->format('M Y'),
                    'revenue' => round($avg, 2),
                    'type'    => 'forecast',
                ];
            }
        }

        // Top products by order frequency
        $topDemand = InvoiceItem::whereHas('invoice', fn($q) => $q->where('company_id', $cid)->where('type', 'sales'))
            ->selectRaw('product_id, SUM(quantity) as total_qty, COUNT(DISTINCT invoice_id) as frequency')
            ->groupBy('product_id')
            ->orderByDesc('total_qty')
            ->limit(10)
            ->with('product:id,name')
            ->get()
            ->map(fn($r) => [
                'product'   => optional($r->product)->name ?? 'Product #'.$r->product_id,
                'total_qty' => (int) $r->total_qty,
                'frequency' => (int) $r->frequency,
            ]);

        return Inertia::render('IndustrialEngineering/DemandForecasting', [
            'historical' => $historical,
            'forecast'   => $forecast,
            'topDemand'  => $topDemand,
        ]);
    }

    // ─── 5. Order Fulfillment Optimization ───────────────────────────────
    public function orderFulfillment()
    {
        $cid = $this->cid();

        // Delivery performance
        $deliveryStats = DB::table('delivery_notes')
            ->where('company_id', $cid)
            ->selectRaw('
                COUNT(*) as total,
                SUM(CASE WHEN status="delivered" THEN 1 ELSE 0 END) as delivered,
                SUM(CASE WHEN status="dispatched" THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status="draft" THEN 1 ELSE 0 END) as cancelled
            ')
            ->first();

        // On-time: delivered within 3 days of dispatch as proxy
        $onTimeData = DB::table('delivery_notes')
            ->where('company_id', $cid)
            ->where('status', 'delivered')
            ->selectRaw('
                SUM(CASE WHEN DATEDIFF(updated_at, dispatch_date) <= 3 THEN 1 ELSE 0 END) as on_time,
                SUM(CASE WHEN DATEDIFF(updated_at, dispatch_date) > 3 THEN 1 ELSE 0 END) as late,
                ROUND(AVG(DATEDIFF(updated_at, dispatch_date)),1) as avg_lead_time
            ')
            ->first();

        // Monthly delivery trend
        $deliveryTrend = DB::table('delivery_notes')
            ->where('company_id', $cid)
            ->whereRaw("created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)")
            ->selectRaw("DATE_FORMAT(created_at,'%b %Y') as month, COUNT(*) as total, SUM(CASE WHEN status='delivered' THEN 1 ELSE 0 END) as delivered")
            ->groupByRaw("DATE_FORMAT(created_at,'%Y-%m'), DATE_FORMAT(created_at,'%b %Y')")
            ->orderByRaw("DATE_FORMAT(created_at,'%Y-%m')")
            ->get();

        // Priority matrix: high-value pending orders
        $priorityOrders = Invoice::where('company_id', $cid)
            ->where('type', 'sales')
            ->whereIn('status', ['sent', 'partial'])
            ->orderByDesc('total_amount')
            ->limit(10)
            ->with('customer:id,name')
            ->get(['id', 'invoice_number', 'total_amount', 'due_date', 'customer_id', 'status']);

        return Inertia::render('IndustrialEngineering/OrderFulfillment', [
            'deliveryStats'  => $deliveryStats,
            'onTimeData'     => $onTimeData,
            'deliveryTrend'  => $deliveryTrend,
            'priorityOrders' => $priorityOrders,
        ]);
    }

    // ─── 6. Standardization & Automation ────────────────────────────────
    public function standardization()
    {
        $cid = $this->cid();

        // Pricing rules count & types
        $pricingRules = DB::table('pricing_rules')->where('company_id', $cid)->selectRaw('type, COUNT(*) as count')->groupBy('type')->get();
        $discountRules = DB::table('discount_rules')->where('company_id', $cid)->selectRaw('type, COUNT(*) as count, SUM(CASE WHEN is_active=1 THEN 1 ELSE 0 END) as active')->groupBy('type')->get();

        // Invoice automation: proforma = auto-generated templates, sales = manually created
        $autoInvoices   = Invoice::where('company_id', $cid)->where('type', 'proforma')->count();
        $manualInvoices = Invoice::where('company_id', $cid)->where('type', 'sales')->count();

        // Error rate: sales_return (credit notes) / total invoices
        $creditNotes  = Invoice::where('company_id', $cid)->where('type', 'sales_return')->count();
        $totalInvFor  = Invoice::where('company_id', $cid)->where('type', 'sales')->count();
        $errorRate    = $totalInvFor > 0 ? round(($creditNotes / $totalInvFor) * 100, 1) : 0;

        // Workflow stats
        $workflowStats = [
            'pricingRules'  => DB::table('pricing_rules')->where('company_id', $cid)->count(),
            'discountRules' => DB::table('discount_rules')->where('company_id', $cid)->count(),
            'autoInvoices'  => $autoInvoices,
            'manualInvoices'=> $manualInvoices,
            'errorRate'     => $errorRate,
            'creditNotes'   => $creditNotes,
        ];

        return Inertia::render('IndustrialEngineering/Standardization', [
            'pricingRules'  => $pricingRules,
            'discountRules' => $discountRules,
            'workflowStats' => $workflowStats,
        ]);
    }

    // ─── 7. Waste Identification (Lean) ──────────────────────────────────
    public function wasteDashboard()
    {
        $cid = $this->cid();

        // Waiting waste: avg days invoices sit in "sent" status
        $waitingAvg = Invoice::where('company_id', $cid)
            ->where('type', 'sales')
            ->where('status', 'sent')
            ->selectRaw('ROUND(AVG(DATEDIFF(NOW(), invoice_date)),1) as avg_wait')
            ->value('avg_wait') ?? 0;

        // Rework: sales_return (credit notes) issued (order errors)
        $reworkCount = Invoice::where('company_id', $cid)->where('type', 'sales_return')->count();

        // Lost opportunities: leads lost
        $lostLeads = Lead::where('company_id', $cid)->where('status', 'lost')->count();
        $totalLeads = Lead::where('company_id', $cid)->count();
        $lostRate   = $totalLeads > 0 ? round(($lostLeads / $totalLeads) * 100, 1) : 0;

        // Idle capacity: overdue open invoices
        $overdueInvoices = Invoice::where('company_id', $cid)
            ->where('type', 'sales')
            ->where('status', 'sent')
            ->whereRaw('due_date < CURDATE()')
            ->count();

        // Overprocessing: quotations not converted
        $unconvertedQuotes = Invoice::where('company_id', $cid)
            ->where('type', 'quotation')
            ->whereNotIn('status', ['converted', 'cancelled'])
            ->where('created_at', '<', now()->subDays(30))
            ->count();

        // Monthly waste trend (sales_return = credit notes)
        $wasteTrend = Invoice::where('company_id', $cid)
            ->where('type', 'sales_return')
            ->whereRaw("created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)")
            ->selectRaw("DATE_FORMAT(created_at,'%b %Y') as month, COUNT(*) as rework")
            ->groupByRaw("DATE_FORMAT(created_at,'%Y-%m'), DATE_FORMAT(created_at,'%b %Y')")
            ->orderByRaw("DATE_FORMAT(created_at,'%Y-%m')")
            ->get();

        // Lost leads per month
        $lostTrend = Lead::where('company_id', $cid)
            ->where('status', 'lost')
            ->whereRaw("created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)")
            ->selectRaw("DATE_FORMAT(created_at,'%b %Y') as month, COUNT(*) as count")
            ->groupByRaw("DATE_FORMAT(created_at,'%Y-%m'), DATE_FORMAT(created_at,'%b %Y')")
            ->orderByRaw("DATE_FORMAT(created_at,'%Y-%m')")
            ->get();

        return Inertia::render('IndustrialEngineering/WasteDashboard', [
            'wastes' => [
                'waiting'           => $waitingAvg,
                'rework'            => $reworkCount,
                'lostLeads'         => $lostLeads,
                'lostRate'          => $lostRate,
                'overdueInvoices'   => $overdueInvoices,
                'unconvertedQuotes' => $unconvertedQuotes,
            ],
            'wasteTrend' => $wasteTrend,
            'lostTrend'  => $lostTrend,
        ]);
    }

    // ─── 8. Cost-to-Serve Analysis ────────────────────────────────────────
    public function costToServe()
    {
        $cid = $this->cid();

        // Cost & margin per customer (cost estimated at 65% of revenue)
        $customerCost = Invoice::where('company_id', $cid)
            ->where('type', 'sales')
            ->whereIn('status', ['paid', 'partial'])
            ->selectRaw('customer_id, SUM(total_amount) as revenue, SUM(total_amount)*0.65 as cost, COUNT(*) as orders')
            ->groupBy('customer_id')
            ->orderByDesc('revenue')
            ->limit(15)
            ->with('customer:id,name')
            ->get()
            ->map(fn($r) => [
                'customer' => optional($r->customer)->name ?? 'Customer #'.$r->customer_id,
                'revenue'  => round($r->revenue, 2),
                'cost'     => round($r->cost, 2),
                'margin'   => $r->revenue > 0 ? round((($r->revenue - $r->cost) / $r->revenue) * 100, 1) : 0,
                'orders'   => $r->orders,
            ]);

        // Low-margin customers (<20%)
        $lowMarginCount = collect($customerCost)->filter(fn($c) => $c['margin'] < 20)->count();

        // Cost per product category (cost = unit_price * 0.65 * qty, since cost_price is on Product not InvoiceItem)
        $categoryCost = InvoiceItem::whereHas('invoice', fn($q) => $q->where('company_id', $cid)->where('type', 'sales')->whereIn('status', ['paid', 'partial']))
            ->selectRaw('product_id, SUM(total) as revenue, SUM(quantity * unit_price * 0.65) as cost')
            ->groupBy('product_id')
            ->with('product:id,name,category_id')
            ->get()
            ->groupBy(fn($r) => optional(optional($r->product)->category)->name ?? 'Uncategorized')
            ->map(fn($g, $cat) => [
                'category' => $cat,
                'revenue'  => round($g->sum('revenue'), 2),
                'cost'     => round($g->sum('cost'), 2),
                'margin'   => $g->sum('revenue') > 0 ? round((($g->sum('revenue') - $g->sum('cost')) / $g->sum('revenue')) * 100, 1) : 0,
            ])
            ->values();

        return Inertia::render('IndustrialEngineering/CostToServe', [
            'customerCost'  => $customerCost,
            'categoryCost'  => $categoryCost,
            'lowMarginCount'=> $lowMarginCount,
        ]);
    }

    // ─── 9. Simulation & What-If Analysis ────────────────────────────────
    public function simulation(Request $request)
    {
        $cid = $this->cid();

        // Base metrics
        $baseRevenue    = (float) Invoice::where('company_id', $cid)->where('type', 'sales')->whereIn('status', ['paid', 'partial'])->whereRaw("YEAR(invoice_date) = YEAR(NOW())")->sum('total_amount');
        $baseCost       = $baseRevenue * 0.65;  // estimated cost at 65%
        $totalLeads     = Lead::where('company_id', $cid)->count();
        $wonLeads       = Lead::where('company_id', $cid)->where('status', 'won')->count();
        $convRate       = $totalLeads > 0 ? ($wonLeads / $totalLeads) : 0;
        $avgOrderValue  = Invoice::where('company_id', $cid)->where('type', 'sales')->whereIn('status', ['paid', 'partial'])->avg('total_amount') ?? 0;

        // Simulation parameters from request or defaults
        $teamSizeChange    = (float) $request->input('teamSizeChange', 0);      // % change
        $priceChange       = (float) $request->input('priceChange', 0);         // % change
        $convRateChange    = (float) $request->input('convRateChange', 0);      // % change
        $inventoryChange   = (float) $request->input('inventoryChange', 0);     // % change

        // Simulate
        $simRevenue  = $baseRevenue * (1 + $priceChange / 100) * (1 + $teamSizeChange / 100 * 0.5) * (1 + $convRateChange / 200);
        $simCost     = $baseCost * (1 + $teamSizeChange / 100 * 0.4);
        $simProfit   = $simRevenue - $simCost;
        $baseProfit  = $baseRevenue - $baseCost;

        return Inertia::render('IndustrialEngineering/Simulation', [
            'baseMetrics' => [
                'revenue'   => round($baseRevenue, 2),
                'cost'      => round($baseCost, 2),
                'profit'    => round($baseProfit, 2),
                'convRate'  => round($convRate * 100, 1),
                'avgOrder'  => round($avgOrderValue, 2),
            ],
            'simResult' => [
                'revenue'  => round($simRevenue, 2),
                'cost'     => round($simCost, 2),
                'profit'   => round($simProfit, 2),
                'change'   => round($simProfit - $baseProfit, 2),
            ],
            'params' => [
                'teamSizeChange'  => $teamSizeChange,
                'priceChange'     => $priceChange,
                'convRateChange'  => $convRateChange,
                'inventoryChange' => $inventoryChange,
            ],
        ]);
    }

    // ─── 10. Continuous Improvement ──────────────────────────────────────
    public function continuousImprovement()
    {
        $cid = $this->cid();

        // Monthly efficiency: orders processed per month
        $monthlyOrders = Invoice::where('company_id', $cid)
            ->where('type', 'sales')
            ->whereRaw("invoice_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)")
            ->selectRaw("DATE_FORMAT(invoice_date,'%b %Y') as month, DATE_FORMAT(invoice_date,'%Y-%m') as period, COUNT(*) as orders, ROUND(SUM(total_amount),2) as revenue, ROUND(AVG(total_amount),2) as avg_order")
            ->groupByRaw("DATE_FORMAT(invoice_date,'%Y-%m'), DATE_FORMAT(invoice_date,'%b %Y')")
            ->orderByRaw("DATE_FORMAT(invoice_date,'%Y-%m')")
            ->get();

        // Lead conversion trend monthly
        $convTrend = Lead::where('company_id', $cid)
            ->whereRaw("created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)")
            ->selectRaw("DATE_FORMAT(created_at,'%b %Y') as month, DATE_FORMAT(created_at,'%Y-%m') as period, COUNT(*) as total, SUM(CASE WHEN status='won' THEN 1 ELSE 0 END) as won")
            ->groupByRaw("DATE_FORMAT(created_at,'%Y-%m'), DATE_FORMAT(created_at,'%b %Y')")
            ->orderByRaw("DATE_FORMAT(created_at,'%Y-%m')")
            ->get()
            ->map(fn($r) => [
                'month' => $r->month,
                'rate'  => $r->total > 0 ? round(($r->won / $r->total) * 100, 1) : 0,
                'total' => $r->total,
                'won'   => $r->won,
            ]);

        // Current vs prev month comparison
        $current  = Invoice::where('company_id', $cid)->where('type', 'sales')->whereRaw("DATE_FORMAT(invoice_date,'%Y-%m') = ?", [now()->format('Y-m')])->selectRaw('COUNT(*) as orders, ROUND(SUM(total_amount),2) as revenue')->first();
        $previous = Invoice::where('company_id', $cid)->where('type', 'sales')->whereRaw("DATE_FORMAT(invoice_date,'%Y-%m') = ?", [now()->subMonth()->format('Y-m')])->selectRaw('COUNT(*) as orders, ROUND(SUM(total_amount),2) as revenue')->first();

        $improvement = [
            'orderGrowth'   => ($previous->orders ?? 0) > 0 ? round((($current->orders - $previous->orders) / $previous->orders) * 100, 1) : 0,
            'revenueGrowth' => ($previous->revenue ?? 0) > 0 ? round((($current->revenue - $previous->revenue) / $previous->revenue) * 100, 1) : 0,
            'currentOrders' => $current->orders ?? 0,
            'prevOrders'    => $previous->orders ?? 0,
            'currentRevenue'=> $current->revenue ?? 0,
            'prevRevenue'   => $previous->revenue ?? 0,
        ];

        return Inertia::render('IndustrialEngineering/ContinuousImprovement', [
            'monthlyOrders' => $monthlyOrders,
            'convTrend'     => $convTrend,
            'improvement'   => $improvement,
        ]);
    }
}
