<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\GoalController;
use App\Http\Controllers\Api\V1\MilestoneController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\TaskController;
use Illuminate\Support\Facades\Route;

// Backward-compatible aliases while older frontend bundles or browser cache
// may still hit the pre-v1 auth endpoints.
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);
    Route::apiResource('goals', GoalController::class);
});

Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::prefix('auth')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
        });

        Route::patch('/profile', [ProfileController::class, 'update']);
        Route::get('dashboard/summary', [DashboardController::class, 'summary']);
        Route::apiResource('goals', GoalController::class);
        Route::get('goals/{goal}/milestones', [MilestoneController::class, 'index']);
        Route::post('goals/{goal}/milestones', [MilestoneController::class, 'store']);
        Route::get('milestones/{milestone}', [MilestoneController::class, 'show']);
        Route::patch('milestones/{milestone}', [MilestoneController::class, 'update']);
        Route::delete('milestones/{milestone}', [MilestoneController::class, 'destroy']);
        Route::post('milestones/{milestone}/tasks', [TaskController::class, 'store']);
        Route::get('tasks/{task}', [TaskController::class, 'show']);
        Route::patch('tasks/{task}', [TaskController::class, 'update']);
        Route::delete('tasks/{task}', [TaskController::class, 'destroy']);
        Route::patch('tasks/{task}/complete', [TaskController::class, 'complete']);
    });
});
