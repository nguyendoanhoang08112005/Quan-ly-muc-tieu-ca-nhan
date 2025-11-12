<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('follows', function (Blueprint $table) {
            $table->id();
            $table->foreignId('follower_id')->constrained('users')->onDelete('cascade');
            $table->morphs('followable'); // followable_type and followable_id
            $table->timestamps();
            
            // Unique constraint - một user chỉ follow một entity một lần
            $table->unique(['follower_id', 'followable_type', 'followable_id']);
            
            // Indexes
            $table->index('follower_id');
            // $table->index(['followable_type', 'followable_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('follows');
    }
};