<?php
namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;

class DeliveryNoteItem extends Model
{
    use LogsActivity;

    public function auditLabel(): string { return '#' . $this->getKey(); }

    protected $fillable = [
        'delivery_note_id', 'product_id', 'invoice_item_id', 'quantity', 'notes',
    ];

    protected $casts = ['quantity' => 'decimal:4'];

    public function deliveryNote() { return $this->belongsTo(DeliveryNote::class); }
    public function product()      { return $this->belongsTo(Product::class); }
    public function invoiceItem()  { return $this->belongsTo(InvoiceItem::class); }
}
