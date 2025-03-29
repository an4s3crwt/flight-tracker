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
        Schema::create('airports', function (Blueprint $table) {
            $table->string('icao', 4)->primary();
            $table->string('iata', 3)->nullable();
            $table->string('name', 100);
            $table->string('country', 50);
            $table->decimal('latitude', 10, 6);
            $table->decimal('longitude', 10, 6);
            $table->decimal('altitude', 10, 2);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('airports');
    }
};
