<?php
namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GoodsReceipt extends Model
{
    use LogsActivity;

    public function auditLabel(): string { return $this->grn_number ?? '#' . $this->getKey(); }

    use SoftDeletes;

    protected $fillable = [
        'company_id', 'purchase_order_id', 'vendor_id', 'grn_number',
        'receipt_date', 'notes', 'status', 'created_by',
    ];

    protected $casts = ['receipt_date' => 'date'];

    public function items()         { return $this->hasMany(GoodsReceiptItem::class); }
    public function purchaseOrder() { return $this->belongsTo(PurchaseOrder::class); }
    public function vendor()        { return $this->belongsTo(Vendor::class); }
    public function creator()       { return $this->belongsTo(User::class, 'created_by'); }
    public function company()       { return $this->belongsTo(Company::class); }
}
