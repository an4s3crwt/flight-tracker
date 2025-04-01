<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavedFlight extends Model
{
    use HasFactory;

    protected $primaryKey = 'saved_id';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'flight_id',
        'saved_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function flight()
    {
        return $this->belongsTo(Flight::class, 'flight_id');
    }
}