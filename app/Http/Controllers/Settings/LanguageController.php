<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Language;
use App\Models\Translation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class LanguageController extends Controller
{
    // ── Admin: Language Management ──────────────────────────────────────────

    /** List all languages */
    public function index(): Response
    {
        $languages = Language::orderBy('sort_order')->orderBy('name')->get();

        return Inertia::render('Settings/Languages/Index', [
            'languages' => $languages,
        ]);
    }

    /** Store a new language */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:100',
            'native_name' => 'nullable|string|max:100',
            'code'        => ['required', 'string', 'max:10', Rule::unique('languages', 'code')],
            'flag'        => 'nullable|string|max:10',
            'is_rtl'      => 'boolean',
            'is_active'   => 'boolean',
            'sort_order'  => 'integer|min:0',
        ]);

        $language = Language::create($data);

        // Copy all keys from English with empty values so translators can fill them
        $englishTranslations = Translation::where('language_code', 'en')->get();
        foreach ($englishTranslations as $t) {
            Translation::firstOrCreate(
                ['language_code' => $language->code, 'group' => $t->group, 'key' => $t->key],
                ['value' => ''] // empty = falls back to English on frontend
            );
        }

        $this->clearLanguageCache();

        return back()->with('success', 'Language added successfully.');
    }

    /** Update language meta */
    public function update(Request $request, Language $language)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:100',
            'native_name' => 'nullable|string|max:100',
            'code'        => ['required', 'string', 'max:10', Rule::unique('languages', 'code')->ignore($language->id)],
            'flag'        => 'nullable|string|max:10',
            'is_rtl'      => 'boolean',
            'is_active'   => 'boolean',
            'sort_order'  => 'integer|min:0',
        ]);

        $language->update($data);
        $this->clearLanguageCache();

        return back()->with('success', 'Language updated successfully.');
    }

    /** Delete a language (cannot delete default) */
    public function destroy(Language $language)
    {
        if ($language->is_default) {
            return back()->with('error', 'Cannot delete the default language.');
        }

        $language->delete();
        $this->clearLanguageCache();

        return back()->with('success', 'Language deleted successfully.');
    }

    /** Set a language as the system default */
    public function setDefault(Language $language)
    {
        $language->setAsDefault();
        $this->clearLanguageCache();

        return back()->with('success', "{$language->name} is now the default language.");
    }

    // ── Translation Management ──────────────────────────────────────────────

    /** Show translations editor for a language */
    public function editTranslations(Language $language): Response
    {
        $translations = Translation::where('language_code', $language->code)
            ->orderBy('group')
            ->orderBy('key')
            ->get()
            ->groupBy('group')
            ->map(fn($group) => $group->mapWithKeys(fn($t) => [$t->key => $t->value]));

        // Get English as reference
        $english = Translation::where('language_code', 'en')
            ->orderBy('group')
            ->orderBy('key')
            ->get()
            ->groupBy('group')
            ->map(fn($group) => $group->mapWithKeys(fn($t) => [$t->key => $t->value]));

        return Inertia::render('Settings/Languages/Translations', [
            'language'     => $language,
            'translations' => $translations,
            'english'      => $english,
        ]);
    }

    /** Save translations for a language */
    public function saveTranslations(Request $request, Language $language)
    {
        $request->validate([
            'translations'         => 'required|array',
            'translations.*.*'     => 'nullable|string',
        ]);

        // $translations = ['nav' => ['dashboard' => 'ড্যাশবোর্ড', ...], ...]
        foreach ($request->translations as $group => $keys) {
            foreach ($keys as $key => $value) {
                Translation::updateOrCreate(
                    ['language_code' => $language->code, 'group' => $group, 'key' => $key],
                    ['value' => $value ?? '']
                );
            }
        }

        // Clear translation cache for this language
        Cache::forget("translations_{$language->code}");

        return back()->with('success', 'Translations saved successfully.');
    }

    // ── User: Switch Language ───────────────────────────────────────────────

    /** Switch the current session language */
    public function switchLanguage(Request $request)
    {
        $request->validate([
            'locale' => ['required', 'string', Rule::exists('languages', 'code')->where('is_active', true)],
        ]);

        $request->session()->put('locale', $request->locale);

        // Optionally save to user preferences
        if ($user = $request->user()) {
            $user->update(['language' => $request->locale]);
        }

        return back();
    }

    // ── Private ─────────────────────────────────────────────────────────────

    private function clearLanguageCache(): void
    {
        Cache::forget('default_language_code');
        Cache::forget('active_language_codes');
    }
}
