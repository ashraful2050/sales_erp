<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class FaqCategory extends Model
{
    use LogsActivity;

    public function auditLabel(): string { return $this->name ?? '#' . $this->getKey(); }

    protected $fillable = [
        'company_id', 'name', 'slug', 'description',
        'icon', 'color', 'sort_order', 'is_active',
    ];

    protected $casts = ['is_active' => 'boolean'];

    public function company() { return $this->belongsTo(Company::class); }
    public function faqs()    { return $this->hasMany(Faq::class); }

    public function getPublishedFaqsCountAttribute(): int
    {
        return $this->faqs()->where('is_published', true)->count();
    }
}
