<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('habit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('habit_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('logged_date');
            $table->boolean('completed')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();
            
            // Unique constraint to prevent duplicate logs
            $table->unique(['habit_id', 'logged_date']);
            
            // Indexes
            $table->index('habit_id');
            $table->index('user_id');
            $table->index('logged_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('habit_logs');
    }
};