<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerSegment extends Model
{
    protected $fillable = ['company_id', 'name', 'description', 'criteria', 'type', 'is_active'];
    protected $casts = ['criteria' => 'array', 'is_active' => 'boolean'];

    public function company()  { return $this->belongsTo(Company::class); }
    public function members()  { return $this->belongsToMany(Customer::class, 'customer_segment_members'); }

    /** Auto-assign customers based on JSON criteria */
    public function syncMembers(): void
    {
        if ($this->type !== 'auto' || !$this->criteria) return;
        $query = Customer::where('company_id', $this->company_id);
        foreach ($this->criteria as $rule) {
            $query->where($rule['field'], $rule['operator'], $rule['value']);
        }
        $this->members()->sync($query->pluck('id')->toArray());
    }
}
