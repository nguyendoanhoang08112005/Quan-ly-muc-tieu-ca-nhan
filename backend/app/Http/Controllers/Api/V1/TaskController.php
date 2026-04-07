<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Milestone;
use App\Models\Task;
use App\Services\GoalProgressService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class TaskController extends Controller
{
    public function __construct(
        private readonly GoalProgressService $goalProgressService
    ) {
    }

    public function store(StoreTaskRequest $request, Milestone $milestone): JsonResponse
    {
        $this->authorize('create', [Task::class, $milestone]);

        $data = $request->validated();
        $status = $data['status'];

        $task = Task::create([
            ...$data,
            'user_id' => $request->user()->id,
            'goal_id' => $milestone->goal_id,
            'milestone_id' => $milestone->id,
            'progress_percentage' => $status === 'completed' ? 100 : 0,
            'started_at' => $status === 'in_progress' ? now() : null,
            'completed_at' => $status === 'completed' ? now() : null,
            'sort_order' => ((int) $milestone->tasks()->max('sort_order')) + 1,
            'is_focus' => (bool) ($data['is_focus'] ?? false),
        ]);

        $this->goalProgressService->syncFromTask($task);

        return response()->json([
            'message' => 'Tao task thanh cong.',
            'data' => new TaskResource($task->fresh()),
        ], 201);
    }

    public function show(Task $task): TaskResource
    {
        $this->authorize('view', $task);

        return new TaskResource($task);
    }

    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        $this->authorize('update', $task);

        $data = $request->validated();

        if (array_key_exists('status', $data)) {
            if ($data['status'] === 'completed') {
                $data['completed_at'] = $task->completed_at ?? now();
                $data['progress_percentage'] = 100;
            } else {
                $data['completed_at'] = null;

                if ((float) $task->progress_percentage === 100.0) {
                    $data['progress_percentage'] = 0;
                }

                if ($data['status'] === 'in_progress' && $task->started_at === null) {
                    $data['started_at'] = now();
                }
            }
        }

        $task->update($data);
        $this->goalProgressService->syncFromTask($task->fresh());

        return response()->json([
            'message' => 'Cap nhat task thanh cong.',
            'data' => new TaskResource($task->fresh()),
        ]);
    }

    public function destroy(Task $task): Response
    {
        $this->authorize('delete', $task);

        $milestone = $task->milestone;
        $goal = $task->goal;

        $task->delete();

        if ($milestone) {
            $this->goalProgressService->syncMilestone($milestone, $task);
        } elseif ($goal) {
            $this->goalProgressService->syncGoal($goal, null, $task);
        }

        return response()->noContent();
    }

    public function complete(Task $task): JsonResponse
    {
        $this->authorize('complete', $task);

        $task->markAsCompleted();
        $this->goalProgressService->syncFromTask($task->fresh());

        return response()->json([
            'message' => 'Hoan thanh task thanh cong.',
            'data' => new TaskResource($task->fresh()),
        ]);
    }
}
