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
        Schema::create('aircraft', function (Blueprint $table) {
            $table->string('icao24', 20)->primary();
            $table->string('registration', 20);
            $table->string('type', 50);
            $table->string('model', 50);
            $table->string('origin_country', 50);
            $table->integer('year_built')->nullable();
            $table->string('airline_icao', 3)->nullable();
            $table->foreign('airline_icao')->references('icao')->on('airlines');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('aircraft');
    }
};
