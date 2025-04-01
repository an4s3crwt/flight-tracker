<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    use HasFactory;

    protected $primaryKey = 'flight_id';
    public $timestamps = false;

    protected $fillable = [
        'aircraft_icao',
        'departure_airport',
        'arrival_airport',
        'airline_icao',
        'callsign',
        'status',
        'longitude',
        'latitude',
        'altitude',
        'velocity',
        'last_update'
    ];

    public function aircraft()
    {
        return $this->belongsTo(Aircraft::class, 'aircraft_icao');
    }

    public function departureAirport()
    {
        return $this->belongsTo(Airport::class, 'departure_airport');
    }

    public function arrivalAirport()
    {
        return $this->belongsTo(Airport::class, 'arrival_airport');
    }

    public function airline()
    {
        return $this->belongsTo(Airline::class, 'airline_icao');
    }

    public function positions()
    {
        return $this->hasMany(FlightPosition::class, 'flight_id');
    }

    public function savedByUsers()
    {
        return $this->hasMany(SavedFlight::class, 'flight_id');
    }
}