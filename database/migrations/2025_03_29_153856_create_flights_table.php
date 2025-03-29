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
        Schema::create('flights', function (Blueprint $table) {
            $table->id('flight_id');
            $table->string('aircraft_icao', 20);
            $table->string('departure_airport', 4);
            $table->string('arrival_airport', 4);
            $table->string('airline_icao', 3)->nullable();
            $table->string('callsign', 10);
            $table->enum('status', ['scheduled', 'departed', 'in_air', 'landed']);
            $table->decimal('longitude', 10, 6)->nullable();
            $table->decimal('latitude', 10, 6)->nullable();
            $table->decimal('altitude', 10, 2)->nullable();
            $table->decimal('velocity', 10, 2)->nullable();
            $table->dateTime('last_update');
            
            $table->foreign('aircraft_icao')->references('icao24')->on('aircraft');
            $table->foreign('departure_airport')->references('icao')->on('airports');
            $table->foreign('arrival_airport')->references('icao')->on('airports');
            $table->foreign('airline_icao')->references('icao')->on('airlines');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flights');
    }
};
