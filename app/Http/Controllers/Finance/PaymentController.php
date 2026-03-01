<?php
namespace App\Http\Controllers\Finance;
use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\PaymentAllocation;
use App\Models\Invoice;
use App\Models\Customer;
use App\Models\Vendor;
use App\Models\BankAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
class PaymentController extends Controller {
    public function index(Request $request) {
        $cid=auth()->user()->company_id;
        $payments=Payment::where("company_id",$cid)->with(["customer:id,name","vendor:id,name","bankAccount:id,bank_name,account_name"])
            ->when($request->search,fn($q,$s)=>$q->where("payment_number","like","%{$s}%"))
            ->when($request->type,fn($q,$v)=>$q->where("type",$v))
            ->latest("payment_date")->paginate(15)->withQueryString();
        return Inertia::render("Finance/Payments/Index",["payments"=>$payments,"filters"=>$request->only("search","type")]);
    }
    public function create(Request $request) {
        $cid=auth()->user()->company_id;
        $invoice = $request->invoice_id
            ? Invoice::where('company_id',$cid)->with('customer:id,name')->findOrFail($request->invoice_id)
            : null;
        return Inertia::render("Finance/Payments/Form",[
            "payment"=>null,
            "invoice"=>$invoice,
            "customers"=>Customer::where("company_id",$cid)->where("is_active",true)->orderBy("name")->get(["id","name"]),
            "vendors"=>Vendor::where("company_id",$cid)->where("is_active",true)->orderBy("name")->get(["id","name"]),
            "bankAccounts"=>BankAccount::where("company_id",$cid)->where("is_active",true)->get(["id","bank_name","account_name","account_number"]),
            "pendingInvoices"=>Invoice::where("company_id",$cid)
                ->whereIn("status",["sent","partial","overdue"])
                ->with("customer:id,name")
                ->orderBy("invoice_date")
                ->get(["id","invoice_number","invoice_date","total_amount","paid_amount","customer_id"]),
        ]);
    }
    public function store(Request $request) {
        $cid=auth()->user()->company_id;
        $v=$request->validate([
            "type"=>"required|in:received,made",
            "invoice_id"=>"nullable|exists:invoices,id",
            "customer_id"=>"nullable|exists:customers,id",
            "vendor_id"=>"nullable|exists:vendors,id",
            "bank_account_id"=>"nullable|exists:bank_accounts,id",
            "payment_date"=>"required|date",
            "amount"=>"required|numeric|min:0.01",
            "currency_code"=>"nullable|max:3",
            "payment_method"=>"required|in:cash,bank,bkash,nagad,rocket,upay,cheque,other",
            "reference"=>"nullable|max:100",
            "notes"=>"nullable",
        ]);
        DB::transaction(function() use ($v,$cid) {
            $num=($v["type"]==="received"?"RV-":"PV-").date("Ymd")."-".str_pad(Payment::where("company_id",$cid)->count()+1,4,"0",STR_PAD_LEFT);
            $invoiceId = $v["invoice_id"] ?? null;
            unset($v["invoice_id"]);
            $payment = Payment::create(array_merge($v,[
                "company_id"=>$cid,
                "status"=>"confirmed",
                "created_by"=>auth()->id(),
                "payment_number"=>$num,
            ]));
            if ($invoiceId) {
                PaymentAllocation::create([
                    "payment_id"=>$payment->id,
                    "reference_type"=>"invoice",
                    "reference_id"=>$invoiceId,
                    "allocated_amount"=>$v["amount"],
                ]);
                $invoice = Invoice::find($invoiceId);
                $newPaid = (float)$invoice->paid_amount + (float)$v["amount"];
                $newPaid = min($newPaid,(float)$invoice->total_amount);
                $newStatus = $newPaid >= (float)$invoice->total_amount ? "paid"
                           : ($newPaid > 0 ? "partial" : $invoice->status);
                $invoice->update(["paid_amount"=>$newPaid,"status"=>$newStatus]);
            }
        });
        return redirect()->route("finance.payments.index")->with("success","Payment recorded successfully.");
    }
    public function show(Payment $payment) {
        abort_if($payment->company_id!==auth()->user()->company_id,403);
        return Inertia::render("Finance/Payments/Show",["payment"=>$payment->load(["customer","vendor","bankAccount","allocations"])]);
    }
    public function edit(Payment $payment) { abort_if($payment->company_id!==auth()->user()->company_id,403); return back(); }
    public function update(Request $request,Payment $payment) { return back(); }
    public function destroy(Payment $payment) {
        abort_if($payment->company_id!==auth()->user()->company_id,403);
        $payment->delete();
        return redirect()->route("finance.payments.index")->with("success","Payment deleted.");
    }
}