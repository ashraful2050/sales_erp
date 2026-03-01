<?php
namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeliveryNote extends Model
{
    use LogsActivity;

    public function auditLabel(): string { return $this->delivery_number ?? '#' . $this->getKey(); }

    use SoftDeletes;

    protected $fillable = [
        'company_id', 'invoice_id', 'customer_id', 'note_number',
        'dispatch_date', 'delivery_address', 'vehicle_no', 'driver_name',
        'notes', 'status', 'created_by',
    ];

    protected $casts = ['dispatch_date' => 'date'];

    public function items()    { return $this->hasMany(DeliveryNoteItem::class); }
    public function invoice()  { return $this->belongsTo(Invoice::class); }
    public function customer() { return $this->belongsTo(Customer::class); }
    public function creator()  { return $this->belongsTo(User::class, 'created_by'); }
    public function company()  { return $this->belongsTo(Company::class); }
}
