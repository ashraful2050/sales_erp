<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Faq extends Model
{
    use LogsActivity;

    public function auditLabel(): string { return $this->question ?? '#' . $this->getKey(); }

    use SoftDeletes;

    protected $fillable = [
        'company_id', 'faq_category_id', 'question', 'answer',
        'tags', 'is_published', 'views', 'helpful_yes', 'helpful_no',
        'sort_order', 'created_by',
    ];

    protected $casts = [
        'tags'         => 'array',
        'is_published' => 'boolean',
    ];

    public function company()  { return $this->belongsTo(Company::class); }
    public function category() { return $this->belongsTo(FaqCategory::class, 'faq_category_id'); }
    public function creator()  { return $this->belongsTo(User::class, 'created_by'); }
}
