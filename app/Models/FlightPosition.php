<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FlightPosition extends Model
{
    use HasFactory;

    protected $primaryKey = 'position_id';
    public $timestamps = false;

    protected $fillable = [
        'flight_id',
        'timestamp',
        'latitude',
        'longitude',
        'altitude',
        'speed'
    ];

    public function flight()
    {
        return $this->belongsTo(Flight::class, 'flight_id');
    }
}