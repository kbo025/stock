<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    protected $fillable = ['brand', 'model', 'color', 'year', 'plate', 'status_id', 'driver_id'];

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function getMyStatusAttribute()
    {
        return trans('vehicle_statuses.' . $this->status_id);
    }

}
