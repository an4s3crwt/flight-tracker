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
        Schema::create('airlines', function (Blueprint $table) {
            $table->string('icao', 3)->primary();
            $table->string('iata', 2)->nullable();
            $table->string('name', 50);
            $table->string('country', 50);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('airlines');
    }
};
