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
        Schema::create('flight_positions', function (Blueprint $table) {
            $table->id('position_id');
            $table->foreignId('flight_id')
                  ->constrained('flights', 'flight_id');
            $table->dateTime('timestamp');
            $table->decimal('latitude', 10, 6);
            $table->decimal('longitude', 10, 6);
            $table->decimal('altitude', 10, 2);
            $table->decimal('speed', 10, 2);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flight_positions');
    }
};
