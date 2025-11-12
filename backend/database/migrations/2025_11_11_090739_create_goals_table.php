<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->date('deadline')->nullable();
            $table->decimal('progress', 5, 2)->default(0.00);
            $table->enum('status', ['active', 'completed', 'on_hold', 'cancelled'])->default('active');
            $table->string('color', 7)->default('#3B82F6');
            $table->boolean('is_public')->default(false);
            $table->json('shared_with')->nullable();
            
            // SMART Goals fields
            $table->text('smart_specific')->nullable();
            $table->text('smart_measurable')->nullable();
            $table->text('smart_achievable')->nullable();
            $table->text('smart_relevant')->nullable();
            $table->text('smart_time_bound')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('user_id');
            $table->index('status');
            $table->index('deadline');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('goals');
    }
};