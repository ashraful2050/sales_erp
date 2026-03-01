<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerFeedback extends Model
{
    protected $fillable = [
        'company_id', 'customer_id', 'customer_name', 'reference_type', 'reference_id',
        'rating', 'category', 'comment', 'sentiment', 'source', 'is_public',
    ];
    protected $casts = ['rating' => 'decimal:1', 'is_public' => 'boolean'];

    public function company()  { return $this->belongsTo(Company::class); }
    public function customer() { return $this->belongsTo(Customer::class); }

    /** Simple rule-based sentiment analysis */
    public static function analyzeSentiment(string $text): string
    {
        $positiveWords = ['great', 'excellent', 'amazing', 'good', 'love', 'perfect', 'happy', 'satisfied', 'wonderful', 'best'];
        $negativeWords = ['bad', 'terrible', 'awful', 'hate', 'poor', 'horrible', 'disappointed', 'worst', 'slow', 'broken'];
        $text = strtolower($text);
        $posCount = 0; $negCount = 0;
        foreach ($positiveWords as $w) if (str_contains($text, $w)) $posCount++;
        foreach ($negativeWords as $w) if (str_contains($text, $w)) $negCount++;
        if ($posCount > $negCount) return 'positive';
        if ($negCount > $posCount) return 'negative';
        return 'neutral';
    }
}
