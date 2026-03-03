<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Language extends Model
{
    protected $fillable = [
        'name',
        'native_name',
        'code',
        'flag',
        'is_rtl',
        'is_active',
        'is_default',
        'sort_order',
    ];

    protected $casts = [
        'is_rtl'      => 'boolean',
        'is_active'   => 'boolean',
        'is_default'  => 'boolean',
        'sort_order'  => 'integer',
    ];

    /** All translations for this language */
    public function translations(): HasMany
    {
        return $this->hasMany(Translation::class, 'language_code', 'code');
    }

    /** Return translations as a flat key map: "group.key" => value */
    public function translationMap(): array
    {
        return $this->translations()
            ->get()
            ->mapWithKeys(fn($t) => ["{$t->group}.{$t->key}" => $t->value])
            ->toArray();
    }

    /** Scope: active languages only */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /** Get the current default language */
    public static function getDefault(): self
    {
        return static::where('is_default', true)->first()
            ?? static::where('code', 'en')->first()
            ?? static::first();
    }

    /** Set a language as the default (unsets others) */
    public function setAsDefault(): void
    {
        static::query()->where('id', '!=', $this->id)->update(['is_default' => false]);
        $this->update(['is_default' => true]);
    }
}
