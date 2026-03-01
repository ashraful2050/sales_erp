<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PurchaseOrder extends Model {
    use LogsActivity;

    public function auditLabel(): string { return $this->po_number ?? '#' . $this->getKey(); }

    use SoftDeletes;
    protected $fillable = [
        "company_id","vendor_id","journal_entry_id","po_number","type",
        "po_date","due_date","currency_code","exchange_rate","subtotal",
        "discount_amount","tax_amount","total_amount","paid_amount","status",
        "notes","terms","created_by",
    ];
    protected $casts = ["po_date" => "date", "due_date" => "date", "total_amount" => "decimal:4"];
    public function company() { return $this->belongsTo(Company::class); }
    public function vendor() { return $this->belongsTo(Vendor::class); }
    public function items() { return $this->hasMany(PurchaseOrderItem::class); }
}
