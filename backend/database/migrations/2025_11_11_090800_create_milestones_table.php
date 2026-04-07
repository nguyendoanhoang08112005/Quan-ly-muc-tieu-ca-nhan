<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('milestones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('goal_id')->constrained()->cascadeOnDelete();
            $table->string('title', 180);
            $table->text('description')->nullable();
            $table->enum('status', ['not_started', 'in_progress', 'completed', 'paused'])->default('not_started');
            $table->decimal('progress_percentage', 5, 2)->default(0);
            $table->date('start_date')->nullable();
            $table->date('target_date')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->unsignedInteger('sequence_no')->default(1);
            $table->text('note')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['goal_id', 'sequence_no']);
            $table->index(['user_id', 'status']);
            $table->index(['user_id', 'target_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('milestones');
    }
};
