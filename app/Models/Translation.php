<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Translation extends Model
{
    protected $fillable = [
        'language_code',
        'group',
        'key',
        'value',
    ];

    public function language(): BelongsTo
    {
        return $this->belongsTo(Language::class, 'language_code', 'code');
    }

    /**
     * Bulk upsert translations for a language.
     * $translations = ['group.key' => 'value', ...]
     */
    public static function bulkUpsert(string $languageCode, array $translations): void
    {
        foreach ($translations as $dotKey => $value) {
            [$group, $key] = str_contains($dotKey, '.')
                ? explode('.', $dotKey, 2)
                : ['ui', $dotKey];

            static::updateOrCreate(
                ['language_code' => $languageCode, 'group' => $group, 'key' => $key],
                ['value' => $value]
            );
        }
    }
}
