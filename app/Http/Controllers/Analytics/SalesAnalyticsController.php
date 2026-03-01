<?php

namespace App\Http\Controllers\Analytics;

use App\Http\Controllers\Controller;
use App\Models\CustomerFeedback;
use App\Models\Invoice;
use App\Models\Lead;
use App\Models\Customer;
use App\Models\SalesForecast;
use App\Models\SupportTicket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SalesAnalyticsController extends Controller
{
    public function index()
    {
        $cid = auth()->user()->company_id;
        return Inertia::render('Analytics/SalesDashboard', [
            'kpis'              => $this->getKpis($cid),
            'revenueChart'      => $this->getRevenueChart($cid),
            'forecastChart'     => $this->getForecastChart($cid),
            'topProducts'       => $this->getTopProducts($cid),
            'topCustomers'      => $this->getTopCustomers($cid),
            'leadFunnel'        => $this->getLeadFunnel($cid),
            'sentimentSummary'  => $this->getSentimentSummary($cid),
            'channelPerformance'=> $this->getChannelPerformance($cid),
            'retentionRisk'     => $this->getRetentionRisk($cid),
        ]);
    }

    private function getKpis(int $cid): array
    {
        $currentMonth  = now()->format('Y-m');
        $previousMonth = now()->subMonth()->format('Y-m');

        $currentRevenue  = (float) Invoice::where('company_id', $cid)->where('type', 'sales')
            ->whereIn('status', ['paid', 'partial', 'sent'])->whereRaw("DATE_FORMAT(invoice_date,'%Y-%m') = ?", [$currentMonth])->sum('total_amount');
        $previousRevenue = (float) Invoice::where('company_id', $cid)->where('type', 'sales')
            ->whereIn('status', ['paid', 'partial', 'sent'])->whereRaw("DATE_FORMAT(invoice_date,'%Y-%m') = ?", [$previousMonth])->sum('total_amount');

        $revenueGrowth = $previousRevenue > 0 ? round((($currentRevenue - $previousRevenue) / $previousRevenue) * 100, 1) : 0;

        $avgOrderValue    = (float) Invoice::where('company_id', $cid)->where('type', 'sales')->whereIn('status', ['paid', 'partial'])->avg('total_amount') ?? 0;
        $totalLeads       = Lead::where('company_id', $cid)->count();
        $wonLeads         = Lead::where('company_id', $cid)->where('status', 'won')->count();
        $conversionRate   = $totalLeads > 0 ? round(($wonLeads / $totalLeads) * 100, 1) : 0;
        $avgSatisfaction  = round((float) SupportTicket::where('company_id', $cid)->whereNotNull('satisfaction_rating')->avg('satisfaction_rating'), 1);

        return [
            'currentRevenue'  => $currentRevenue,
            'revenueGrowth'   => $revenueGrowth,
            'avgOrderValue'   => round($avgOrderValue, 2),
            'totalLeads'      => $totalLeads,
            'wonLeads'        => $wonLeads,
            'conversionRate'  => $conversionRate,
            'avgSatisfaction' => $avgSatisfaction,
        ];
    }

    private function getRevenueChart(int $cid): array
    {
        $months = [];
        for ($i = 11; $i >= 0; $i--) {
            $date   = now()->subMonths($i);
            $period = $date->format('Y-m');
            $label  = $date->format('M Y');
            $actual = (float) Invoice::where('company_id', $cid)->where('type', 'sales')
                ->whereIn('status', ['paid', 'partial', 'sent'])
                ->whereRaw("DATE_FORMAT(invoice_date,'%Y-%m') = ?", [$period])
                ->sum('total_amount');
            $months[] = ['period' => $period, 'label' => $label, 'actual' => round($actual, 2)];
        }
        return $months;
    }

    private function getForecastChart(int $cid): array
    {
        // Generate or retrieve forecasts for the next 6 months
        $forecasts = [];
        $history   = $this->getRevenueChart($cid);
        $values    = array_column($history, 'actual');

        for ($i = 1; $i <= 6; $i++) {
            $date   = now()->addMonths($i);
            $period = $date->format('Y-m');
            $label  = $date->format('M Y');

            // Moving average forecast (last 3 months)
            $sample   = array_slice($values, -3);
            $forecast = count($sample) > 0 ? array_sum($sample) / count($sample) : 0;
            // Apply trend
            if (count($values) >= 2) {
                $trend    = ($values[count($values)-1] - $values[0]) / count($values);
                $forecast = $forecast + ($trend * $i * 0.5);
            }
            $forecast  = max(0, round($forecast, 2));
            $confidence = max(50, 90 - ($i * 5)); // Decreasing confidence

            // Store/update forecast
            SalesForecast::updateOrCreate(
                ['company_id' => $cid, 'period' => $period, 'type' => 'revenue'],
                ['forecasted_value' => $forecast, 'confidence_score' => $confidence, 'method' => 'moving_average']
            );

            $values[]   = $forecast;
            $forecasts[] = ['period' => $period, 'label' => $label, 'forecasted' => $forecast, 'confidence' => $confidence];
        }
        return $forecasts;
    }

    private function getTopProducts(int $cid): array
    {
        return DB::table('invoice_items')
            ->join('invoices', 'invoices.id', '=', 'invoice_items.invoice_id')
            ->join('products', 'products.id', '=', 'invoice_items.product_id')
            ->where('invoices.company_id', $cid)
            ->where('invoices.type', 'sales')
            ->whereIn('invoices.status', ['paid', 'partial', 'sent'])
            ->where('invoices.invoice_date', '>=', now()->subMonths(3))
            ->select('products.name', DB::raw('SUM(invoice_items.quantity) as total_qty'), DB::raw('SUM(invoice_items.total) as total_revenue'))
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_revenue')
            ->limit(10)
            ->get()
            ->toArray();
    }

    private function getTopCustomers(int $cid): array
    {
        return DB::table('invoices')
            ->join('customers', 'customers.id', '=', 'invoices.customer_id')
            ->where('invoices.company_id', $cid)
            ->where('invoices.type', 'sales')
            ->whereIn('invoices.status', ['paid', 'partial', 'sent'])
            ->select('customers.id', 'customers.name', DB::raw('COUNT(invoices.id) as order_count'), DB::raw('SUM(invoices.total_amount) as total_spent'))
            ->groupBy('customers.id', 'customers.name')
            ->orderByDesc('total_spent')
            ->limit(10)
            ->get()
            ->toArray();
    }

    private function getLeadFunnel(int $cid): array
    {
        $stages = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won'];
        $funnel = [];
        foreach ($stages as $stage) {
            $funnel[] = [
                'stage' => $stage,
                'count' => Lead::where('company_id', $cid)->where('status', $stage)->count(),
                'value' => (float) Lead::where('company_id', $cid)->where('status', $stage)->sum('estimated_value'),
            ];
        }
        return $funnel;
    }

    private function getSentimentSummary(int $cid): array
    {
        $total    = CustomerFeedback::where('company_id', $cid)->count();
        $positive = CustomerFeedback::where('company_id', $cid)->where('sentiment', 'positive')->count();
        $neutral  = CustomerFeedback::where('company_id', $cid)->where('sentiment', 'neutral')->count();
        $negative = CustomerFeedback::where('company_id', $cid)->where('sentiment', 'negative')->count();
        $avgRating= round((float) CustomerFeedback::where('company_id', $cid)->avg('rating'), 1);
        return compact('total', 'positive', 'neutral', 'negative', 'avgRating');
    }

    private function getChannelPerformance(int $cid): array
    {
        return SupportTicket::where('company_id', $cid)
            ->select('channel', DB::raw('COUNT(*) as total'), DB::raw('AVG(satisfaction_rating) as avg_rating'))
            ->groupBy('channel')
            ->get()
            ->toArray();
    }

    private function getRetentionRisk(int $cid): array
    {
        // Identify customers at churn risk: no purchase in last 90 days but had purchases before
        $atRisk = DB::table('customers')
            ->where('customers.company_id', $cid)
            ->where('customers.is_active', true)
            ->whereExists(function ($q) {
                $q->from('invoices')
                  ->whereColumn('invoices.customer_id', 'customers.id')
                  ->where('invoices.type', 'sales')
                  ->where('invoices.invoice_date', '<', now()->subDays(90));
            })
            ->whereNotExists(function ($q) {
                $q->from('invoices')
                  ->whereColumn('invoices.customer_id', 'customers.id')
                  ->where('invoices.type', 'sales')
                  ->where('invoices.invoice_date', '>=', now()->subDays(90));
            })
            ->select('customers.id', 'customers.name', 'customers.email')
            ->limit(10)
            ->get()
            ->toArray();

        return $atRisk;
    }

    public function customerFeedback(Request $request)
    {
        $cid      = auth()->user()->company_id;
        $feedback = CustomerFeedback::where('company_id', $cid)
            ->with('customer:id,name')
            ->when($request->sentiment, fn($q, $s) => $q->where('sentiment', $s))
            ->when($request->category,  fn($q, $c) => $q->where('category', $c))
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        $summary = $this->getSentimentSummary($cid);
        return Inertia::render('Analytics/CustomerFeedback', [
            'feedbacks' => $feedback,
            'summary'   => $summary,
            'filters'   => $request->only('sentiment', 'category'),
        ]);
    }

    public function storeFeedback(Request $request)
    {
        $v = $request->validate([
            'customer_id'   => 'nullable|exists:customers,id',
            'customer_name' => 'nullable|max:255',
            'rating'        => 'required|numeric|min:1|max:5',
            'category'      => 'nullable|in:product,service,support,delivery,pricing,overall',
            'feedback_text' => 'nullable|max:2000',
        ]);
        $v['comment'] = $v['feedback_text'] ?? null;
        unset($v['feedback_text']);
        $v['company_id'] = auth()->user()->company_id;
        if ($v['comment']) {
            $v['sentiment'] = CustomerFeedback::analyzeSentiment($v['comment']);
        }
        CustomerFeedback::create($v);
        return back()->with('success', 'Feedback recorded.');
    }
}
