<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RawMaterial extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'stock',
        'barcode',
        'type',
        'status',
        'unit_id',
        'shop_id',
    ];

    // public function shop()
    // {
    //     return $this->belongsTo(Shop::class);
    // }

    // public function getStatus()
    // {
    //     return trans('vehicle_statuses.' . $this->status_id);
    // }

    // public function getFuelType()
    // {
    //     return trans('fuel_type_statuses.' . $this->status_id);
    // }    

}