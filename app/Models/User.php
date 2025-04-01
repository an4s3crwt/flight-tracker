<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasFactory;

    protected $primaryKey = 'user_id';
    public $timestamps = false;

    protected $fillable = [
        'username',
        'email',
        'password_hash',
        'created_at',
        'last_login'
    ];

    public function preferences()
    {
        return $this->hasMany(UserPreferences::class, 'user_id');
    }

    public function savedFlights()
    {
        return $this->hasMany(SavedFlight::class, 'user_id');
    }
}