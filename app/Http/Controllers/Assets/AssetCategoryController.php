<?php
namespace App\Http\Controllers\Assets;
use App\Http\Controllers\Controller;
use App\Models\AssetCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssetCategoryController extends Controller {
    public function index() {
        $cid = auth()->user()->company_id;
        return Inertia::render('Assets/AssetCategories/Index', [
            'categories' => AssetCategory::where('company_id', $cid)->orderBy('name')->get()
        ]);
    }
    public function store(Request $request) {
        $v = $request->validate([
            'name' => 'required|max:100',
            'useful_life_years' => 'required|numeric|min:1|max:100',
            'depreciation_rate' => 'required|numeric|min:0|max:100',
            'depreciation_method' => 'required|in:straight_line,declining_balance,sum_of_years',
        ]);
        $v['company_id'] = auth()->user()->company_id;
        $v['is_active'] = true;
        AssetCategory::create($v);
        return back()->with('success', 'Asset category created.');
    }
    public function update(Request $request, AssetCategory $assetCategory) {
        abort_if($assetCategory->company_id !== auth()->user()->company_id, 403);
        $v = $request->validate([
            'name' => 'required|max:100',
            'useful_life_years' => 'required|numeric|min:1|max:100',
            'depreciation_rate' => 'required|numeric|min:0|max:100',
            'depreciation_method' => 'required|in:straight_line,declining_balance,sum_of_years',
            'is_active' => 'boolean',
        ]);
        $assetCategory->update($v);
        return back()->with('success', 'Asset category updated.');
    }
    public function destroy(AssetCategory $assetCategory) {
        abort_if($assetCategory->company_id !== auth()->user()->company_id, 403);
        $assetCategory->delete();
        return back()->with('success', 'Asset category deleted.');
    }
}
