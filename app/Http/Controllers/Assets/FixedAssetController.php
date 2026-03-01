<?php
namespace App\Http\Controllers\Assets;
use App\Http\Controllers\Controller;
use App\Models\FixedAsset;
use App\Models\AssetCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
class FixedAssetController extends Controller {
    public function index(Request $request) {
        $cid=auth()->user()->company_id;
        $assets=FixedAsset::where("company_id",$cid)->with("category:id,name")
            ->when($request->search,fn($q,$s)=>$q->where("name","like","%{$s}%")->orWhere("asset_code","like","%{$s}%"))
            ->when($request->category_id,fn($q,$v)=>$q->where("asset_category_id",$v))
            ->when($request->status,fn($q,$v)=>$q->where("status",$v))
            ->orderBy("name")->paginate(15)->withQueryString();
        return Inertia::render("Assets/FixedAssets/Index",["assets"=>$assets,"filters"=>$request->only("search","category_id","status"),"categories"=>AssetCategory::where("company_id",$cid)->get(["id","name"])]);
    }
    public function create() {
        $cid=auth()->user()->company_id;
        return Inertia::render("Assets/FixedAssets/Form",["asset"=>null,"categories"=>AssetCategory::where("company_id",$cid)->where("is_active",true)->get(["id","name","depreciation_method","useful_life_years","depreciation_rate"])]);
    }
    public function store(Request $request) {
        $cid=auth()->user()->company_id;
        $v=$request->validate(["name"=>"required|max:255","name_bn"=>"nullable|max:255","asset_code"=>"nullable|max:30","category_id"=>"required|exists:asset_categories,id","purchase_date"=>"required|date","purchase_cost"=>"required|numeric|min:0","salvage_value"=>"nullable|numeric|min:0","depreciation_method"=>"required|in:straight_line,declining_balance,sum_of_years","useful_life_years"=>"required|numeric|min:1","depreciation_rate"=>"required|numeric|min:0","location"=>"nullable|max:255","description"=>"nullable"]);
        $v["company_id"]=$cid;
        $v["book_value"]=max(0,$v["purchase_cost"]-($v["salvage_value"]??0));
        $v["status"]="active";
        $v["asset_category_id"]=$v["category_id"];unset($v["category_id"]);
        FixedAsset::create($v);
        return redirect()->route("assets.fixed-assets.index")->with("success","Fixed asset added.");
    }
    public function show(FixedAsset $fixedAsset) {
        abort_if($fixedAsset->company_id!==auth()->user()->company_id,403);
        return Inertia::render("Assets/FixedAssets/Show",["asset"=>$fixedAsset->load(["category","depreciations"=>fn($q)=>$q->orderByDesc("depreciation_date")])]);
    }
    public function edit(FixedAsset $fixedAsset) {
        abort_if($fixedAsset->company_id!==auth()->user()->company_id,403);
        $cid=auth()->user()->company_id;
        return Inertia::render("Assets/FixedAssets/Form",["asset"=>$fixedAsset,"categories"=>AssetCategory::where("company_id",$cid)->where("is_active",true)->get(["id","name","depreciation_method","useful_life_years","depreciation_rate"])]);
    }
    public function update(Request $request,FixedAsset $fixedAsset) {
        abort_if($fixedAsset->company_id!==auth()->user()->company_id,403);
        $v=$request->validate(["name"=>"required|max:255","name_bn"=>"nullable|max:255","asset_code"=>"nullable|max:30","category_id"=>"required|exists:asset_categories,id","purchase_date"=>"required|date","purchase_cost"=>"required|numeric|min:0","salvage_value"=>"nullable|numeric|min:0","depreciation_method"=>"required|in:straight_line,declining_balance,sum_of_years","useful_life_years"=>"required|numeric|min:1","depreciation_rate"=>"required|numeric|min:0","location"=>"nullable|max:255","status"=>"required|in:active,disposed,written_off","description"=>"nullable"]);
        $v["asset_category_id"]=$v["category_id"];unset($v["category_id"]);
        $fixedAsset->update($v);
        return redirect()->route("assets.fixed-assets.index")->with("success","Fixed asset updated.");
    }
    public function destroy(FixedAsset $fixedAsset) {
        abort_if($fixedAsset->company_id!==auth()->user()->company_id,403);
        $fixedAsset->delete();
        return redirect()->route("assets.fixed-assets.index")->with("success","Fixed asset deleted.");
    }
}