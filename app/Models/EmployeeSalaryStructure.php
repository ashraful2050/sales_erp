<?php

namespace App\Models;

use App\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;

class EmployeeSalaryStructure extends Model
{
    use LogsActivity;

    public function auditLabel(): string { return '#' . $this->getKey(); }

    //
}
