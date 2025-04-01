<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPreferences extends Model
{
    use HasFactory;

    protected $primaryKey = 'preferences_id';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'map_style'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}