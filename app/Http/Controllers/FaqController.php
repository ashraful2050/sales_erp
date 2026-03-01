<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use App\Models\FaqCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FaqController extends Controller
{
    private function cid(): int
    {
        return auth()->user()->company_id;
    }

    /* ─── Public knowledge-base browse ─────────────────────── */

    public function index(Request $request)
    {
        $cid        = $this->cid();
        $search     = $request->get('search');
        $categoryId = $request->get('category');

        $categories = FaqCategory::where('company_id', $cid)
            ->where('is_active', true)
            ->withCount(['faqs as faq_count' => fn($q) => $q->where('is_published', true)])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        $query = Faq::where('company_id', $cid)
            ->where('is_published', true)
            ->with('category:id,name,icon,color');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('question', 'like', "%{$search}%")
                  ->orWhere('answer', 'like', "%{$search}%");
            });
        }

        if ($categoryId) {
            $query->where('faq_category_id', $categoryId);
        }

        $faqs = $query->orderBy('sort_order')->orderBy('created_at', 'desc')->get();

        return Inertia::render('FAQ/Index', [
            'categories'     => $categories,
            'faqs'           => $faqs,
            'filters'        => ['search' => $search, 'category' => $categoryId],
        ]);
    }

    public function show(Faq $faq)
    {
        abort_if($faq->company_id !== $this->cid(), 403);
        abort_unless($faq->is_published, 404);

        // Increment view count
        $faq->increment('views');

        $related = Faq::where('company_id', $this->cid())
            ->where('is_published', true)
            ->where('faq_category_id', $faq->faq_category_id)
            ->where('id', '!=', $faq->id)
            ->orderBy('sort_order')
            ->limit(5)
            ->get(['id', 'question']);

        return Inertia::render('FAQ/Show', [
            'faq'     => $faq->load('category:id,name,icon,color'),
            'related' => $related,
        ]);
    }

    public function helpful(Request $request, Faq $faq)
    {
        abort_if($faq->company_id !== $this->cid(), 403);
        $v = $request->validate(['helpful' => 'required|boolean']);
        $v['helpful'] ? $faq->increment('helpful_yes') : $faq->increment('helpful_no');
        return back()->with('success', 'Thank you for your feedback!');
    }

    /* ─── Admin CRUD: FAQs ──────────────────────────────────── */

    public function adminIndex(Request $request)
    {
        $cid    = $this->cid();
        $search = $request->get('search');
        $catId  = $request->get('category');

        $query = Faq::where('company_id', $cid)->with('category:id,name,icon,color');

        if ($search) {
            $query->where('question', 'like', "%{$search}%");
        }
        if ($catId) {
            $query->where('faq_category_id', $catId);
        }

        $faqs = $query->withTrashed()->orderBy('sort_order')->orderBy('created_at', 'desc')->paginate(20)->withQueryString();

        $categories = FaqCategory::where('company_id', $cid)->orderBy('name')->get(['id', 'name', 'icon', 'color']);

        return Inertia::render('FAQ/Admin/Index', [
            'faqs'       => $faqs,
            'categories' => $categories,
            'filters'    => ['search' => $search, 'category' => $catId],
        ]);
    }

    public function create()
    {
        $cid        = $this->cid();
        $categories = FaqCategory::where('company_id', $cid)->where('is_active', true)->orderBy('name')->get(['id', 'name', 'icon', 'color']);
        return Inertia::render('FAQ/Admin/Form', ['editFaq' => null, 'categories' => $categories]);
    }

    public function store(Request $request)
    {
        $v = $request->validate([
            'faq_category_id' => 'nullable|exists:faq_categories,id',
            'question'        => 'required|string|max:500',
            'answer'          => 'required|string',
            'tags'            => 'nullable|array',
            'tags.*'          => 'string|max:50',
            'is_published'    => 'boolean',
            'sort_order'      => 'integer|min:0',
        ]);

        Faq::create(array_merge($v, [
            'company_id' => $this->cid(),
            'created_by' => auth()->id(),
        ]));

        return redirect()->route('faq.admin.index')->with('success', 'FAQ article created.');
    }

    public function edit(Faq $faq)
    {
        abort_if($faq->company_id !== $this->cid(), 403);
        $categories = FaqCategory::where('company_id', $this->cid())->where('is_active', true)->orderBy('name')->get(['id', 'name', 'icon', 'color']);
        return Inertia::render('FAQ/Admin/Form', ['editFaq' => $faq->load('category'), 'categories' => $categories]);
    }

    public function update(Request $request, Faq $faq)
    {
        abort_if($faq->company_id !== $this->cid(), 403);
        $v = $request->validate([
            'faq_category_id' => 'nullable|exists:faq_categories,id',
            'question'        => 'required|string|max:500',
            'answer'          => 'required|string',
            'tags'            => 'nullable|array',
            'tags.*'          => 'string|max:50',
            'is_published'    => 'boolean',
            'sort_order'      => 'integer|min:0',
        ]);
        $faq->update($v);
        return redirect()->route('faq.admin.index')->with('success', 'FAQ article updated.');
    }

    public function destroy(Faq $faq)
    {
        abort_if($faq->company_id !== $this->cid(), 403);
        $faq->delete();
        return back()->with('success', 'FAQ deleted.');
    }

    /* ─── Admin CRUD: Categories ────────────────────────────── */

    public function categoriesIndex()
    {
        $categories = FaqCategory::where('company_id', $this->cid())
            ->withCount(['faqs as faq_count'])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return Inertia::render('FAQ/Categories', ['categories' => $categories]);
    }

    public function storeCategory(Request $request)
    {
        $v = $request->validate([
            'name'        => 'required|string|max:100',
            'description' => 'nullable|string|max:300',
            'icon'        => 'nullable|string|max:10',
            'color'       => 'nullable|string|max:30',
            'sort_order'  => 'integer|min:0',
            'is_active'   => 'boolean',
        ]);
        FaqCategory::create(array_merge($v, ['company_id' => $this->cid()]));
        return back()->with('success', 'Category created.');
    }

    public function updateCategory(Request $request, FaqCategory $faqCategory)
    {
        abort_if($faqCategory->company_id !== $this->cid(), 403);
        $v = $request->validate([
            'name'        => 'required|string|max:100',
            'description' => 'nullable|string|max:300',
            'icon'        => 'nullable|string|max:10',
            'color'       => 'nullable|string|max:30',
            'sort_order'  => 'integer|min:0',
            'is_active'   => 'boolean',
        ]);
        $faqCategory->update($v);
        return back()->with('success', 'Category updated.');
    }

    public function destroyCategory(FaqCategory $faqCategory)
    {
        abort_if($faqCategory->company_id !== $this->cid(), 403);
        $faqCategory->delete();
        return back()->with('success', 'Category deleted.');
    }
}
