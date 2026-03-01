<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class AccountGroup extends Model {
    use LogsActivity;

    public function auditLabel(): string { return $this->name ?? '#' . $this->getKey(); }

    protected $fillable = ["company_id","parent_id","name","name_bn","type","nature","sort_order"];
    public function company() { return $this->belongsTo(Company::class); }
    public function parent() { return $this->belongsTo(AccountGroup::class, "parent_id"); }
    public function children() { return $this->hasMany(AccountGroup::class, "parent_id"); }
    public function accounts() { return $this->hasMany(Account::class); }
}
