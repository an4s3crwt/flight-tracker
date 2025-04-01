<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('saved_flights', function (Blueprint $table) {
            $table->id('saved_id');
            $table->foreignId('user_id')
                  ->constrained('users', 'user_id');
            $table->foreignId('flight_id')
                  ->constrained('flights', 'flight_id');
            $table->dateTime('saved_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saved_flights');
    }
};
