<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class Department extends Model {
    use LogsActivity;

    public function auditLabel(): string { return $this->name ?? '#' . $this->getKey(); }

    protected $fillable = ["company_id","name","code","parent_id","is_active"];
    protected $casts = ["is_active" => "boolean"];
    public function employees() { return $this->hasMany(Employee::class); }
    public function parent() { return $this->belongsTo(Department::class, "parent_id"); }
}
