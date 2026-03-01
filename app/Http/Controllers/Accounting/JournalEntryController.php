<?php
namespace App\Http\Controllers\Accounting;
use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\JournalEntry;
use App\Models\JournalEntryLine;
use Illuminate\Http\Request;
use Inertia\Inertia;
class JournalEntryController extends Controller {
    public function index(Request $request) {
        $cid=auth()->user()->company_id;
        $entries=JournalEntry::where("company_id",$cid)
            ->when($request->search,fn($q,$s)=>$q->where("voucher_number","like","%{$s}%")->orWhere("narration","like","%{$s}%"))
            ->when($request->type,fn($q,$v)=>$q->where("type",$v))
            ->when($request->status,fn($q,$v)=>$q->where("status",$v))
            ->latest("date")->with("createdBy:id,name")->paginate(15)->withQueryString();
        return Inertia::render("Accounting/JournalEntries/Index",["entries"=>$entries,"filters"=>$request->only("search","type","status")]);
    }
    public function create() {
        $cid=auth()->user()->company_id;
        return Inertia::render("Accounting/JournalEntries/Form",["entry"=>null,"accounts"=>Account::where("company_id",$cid)->where("is_active",true)->orderBy("code")->get(["id","code","name","type"])]);
    }
    public function store(Request $request) {
        $cid=auth()->user()->company_id;
        $v=$request->validate(["type"=>"required|in:journal,payment,receipt,contra","date"=>"required|date","narration"=>"nullable","reference"=>"nullable","currency_code"=>"nullable|max:3","lines"=>"required|array|min:2","lines.*.account_id"=>"required|exists:accounts,id","lines.*.debit"=>"nullable|numeric|min:0","lines.*.credit"=>"nullable|numeric|min:0","lines.*.description"=>"nullable"]);
        $totalDebit=collect($request->lines)->sum(fn($l)=>(float)($l["debit"]??0));
        $totalCredit=collect($request->lines)->sum(fn($l)=>(float)($l["credit"]??0));
        if(abs($totalDebit-$totalCredit)>0.01) return back()->withErrors(["lines"=>"Total debits must equal total credits."]);
        $num="JV-".date("Ymd")."-".str_pad(JournalEntry::where("company_id",$cid)->count()+1,5,"0",STR_PAD_LEFT);
        $entry=JournalEntry::create(["company_id"=>$cid,"voucher_number"=>$num,"type"=>$v["type"],"date"=>$v["date"],"narration"=>$v["narration"]??null,"reference"=>$v["reference"]??null,"currency_code"=>$v["currency_code"]??"BDT","exchange_rate"=>1,"status"=>"draft","created_by"=>auth()->id()]);
        foreach($request->lines as $i=>$line) {
            JournalEntryLine::create(["journal_entry_id"=>$entry->id,"account_id"=>$line["account_id"],"debit"=>(float)($line["debit"]??0),"credit"=>(float)($line["credit"]??0),"description"=>$line["description"]??null,"sort_order"=>$i]);
        }
        return redirect()->route("accounting.journal-entries.show",$entry)->with("success","Journal entry created.");
    }
    public function show(JournalEntry $journalEntry) {
        abort_if($journalEntry->company_id!==auth()->user()->company_id,403);
        return Inertia::render("Accounting/JournalEntries/Show",["entry"=>$journalEntry->load(["lines.account","createdBy:id,name"])]);
    }
    public function edit(JournalEntry $journalEntry) {
        abort_if($journalEntry->company_id!==auth()->user()->company_id,403);
        abort_if($journalEntry->status==="posted",403,"Posted entries cannot be edited.");
        $cid=auth()->user()->company_id;
        return Inertia::render("Accounting/JournalEntries/Form",["entry"=>$journalEntry->load("lines"),"accounts"=>Account::where("company_id",$cid)->where("is_active",true)->orderBy("code")->get(["id","code","name","type"])]);
    }
    public function update(Request $request,JournalEntry $journalEntry) {
        abort_if($journalEntry->company_id!==auth()->user()->company_id,403);
        abort_if($journalEntry->status==="posted",403);
        return redirect()->route("accounting.journal-entries.show",$journalEntry)->with("success","Journal entry updated.");
    }
    public function destroy(JournalEntry $journalEntry) {
        abort_if($journalEntry->company_id!==auth()->user()->company_id,403);
        abort_if($journalEntry->status==="posted",403,"Posted entries cannot be deleted.");
        $journalEntry->lines()->delete();
        $journalEntry->delete();
        return redirect()->route("accounting.journal-entries.index")->with("success","Journal entry deleted.");
    }
    public function post(JournalEntry $journalEntry) {
        abort_if($journalEntry->company_id!==auth()->user()->company_id,403);
        $journalEntry->update(["status"=>"posted","posted_at"=>now(),"approved_by"=>auth()->id()]);
        return back()->with("success","Journal entry posted.");
    }
}