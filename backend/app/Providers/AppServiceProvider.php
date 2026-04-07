<?php

namespace App\Providers;

use App\Models\Goal;
use App\Models\Milestone;
use App\Models\Task;
use App\Policies\GoalPolicy;
use App\Policies\MilestonePolicy;
use App\Policies\TaskPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Goal::class, GoalPolicy::class);
        Gate::policy(Milestone::class, MilestonePolicy::class);
        Gate::policy(Task::class, TaskPolicy::class);
    }
}
