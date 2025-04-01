<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aircraft extends Model
{
    use HasFactory;

    protected $primaryKey = 'icao24';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'icao24',
        'registration',
        'type',
        'model',
        'origin_country',
        'year_built',
        'airline_icao'
    ];

    public function airline()
    {
        return $this->belongsTo(Airline::class, 'airline_icao');
    }

    public function flights()
    {
        return $this->hasMany(Flight::class, 'aircraft_icao');
    }
}