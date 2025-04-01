<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Airport extends Model
{
    use HasFactory;

    protected $primaryKey = 'icao';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'icao',
        'iata',
        'name',
        'country',
        'latitude',
        'longitude',
        'altitude'
    ];

    public function departureFlights()
    {
        return $this->hasMany(Flight::class, 'departure_airport');
    }

    public function arrivalFlights()
    {
        return $this->hasMany(Flight::class, 'arrival_airport');
    }
}