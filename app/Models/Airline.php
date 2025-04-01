<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Airline extends Model
{
    use HasFactory;

    protected $primaryKey = 'icao';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'icao',
        'iata',
        'name',
        'country'
    ];

    public function aircraft()
    {
        return $this->hasMany(Aircraft::class, 'airline_icao');
    }

    public function flights()
    {
        return $this->hasMany(Flight::class, 'airline_icao');
    }
}