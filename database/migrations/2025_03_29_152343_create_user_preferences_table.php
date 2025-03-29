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
        Schema::create('user_preferences', function (Blueprint $table) {
            $table->id('preferences_id');
            $table->unsignedBigInteger('user_id');  // Aseguramos que sea unsignedBigInteger
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');  // Establece la clave foránea correctamente
            $table->string('map_style', 20);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_preferences');
    }
};
