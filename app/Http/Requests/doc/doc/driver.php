<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    protected $fillable = ['rg', 'cpf', 'first_name', 'last_name', 'password', 'phone', 'address', 'status_id'];

    public function getNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function getMyStatusAttribute()
    {
        return trans('driver_statuses.' . $this->status_id);
    }
}