<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('goal_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('goal_id')->constrained()->cascadeOnDelete();
            $table->foreignId('milestone_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('task_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('log_type', ['progress_update', 'status_change', 'note', 'risk', 'completion']);
            $table->string('title', 180)->nullable();
            $table->longText('content')->nullable();
            $table->json('old_value')->nullable();
            $table->json('new_value')->nullable();
            $table->decimal('progress_snapshot', 5, 2)->nullable();
            $table->dateTime('logged_at');
            $table->timestamps();

            $table->index(['goal_id', 'logged_at']);
            $table->index(['user_id', 'log_type']);
            $table->index('milestone_id');
            $table->index('task_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('goal_logs');
    }
};
