<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMilestoneRequest;
use App\Http\Requests\UpdateMilestoneRequest;
use App\Http\Resources\MilestoneResource;
use App\Models\Goal;
use App\Models\Milestone;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class MilestoneController extends Controller
{
    public function index(Request $request, Goal $goal)
    {
        $this->authorize('viewAny', [Milestone::class, $goal]);

        $milestones = $goal->milestones()
            ->withCount('tasks')
            ->orderBy('sequence_no')
            ->get();

        return MilestoneResource::collection($milestones);
    }

    public function store(StoreMilestoneRequest $request, Goal $goal): JsonResponse
    {
        $this->authorize('create', [Milestone::class, $goal]);

        $data = $request->validated();
        $status = $data['status'];

        $milestone = Milestone::create([
            ...$data,
            'user_id' => $request->user()->id,
            'goal_id' => $goal->id,
            'sequence_no' => $data['sequence_no'] ?? ((int) $goal->milestones()->max('sequence_no') + 1),
            'progress_percentage' => $status === 'completed' ? 100 : 0,
            'completed_at' => $status === 'completed' ? now() : null,
        ]);

        return response()->json([
            'message' => 'Tao milestone thanh cong.',
            'data' => new MilestoneResource($milestone->fresh()->loadCount('tasks')),
        ], 201);
    }

    public function show(Milestone $milestone): MilestoneResource
    {
        $this->authorize('view', $milestone);

        return new MilestoneResource($milestone->loadCount('tasks'));
    }

    public function update(UpdateMilestoneRequest $request, Milestone $milestone): JsonResponse
    {
        $this->authorize('update', $milestone);

        $data = $request->validated();

        if (array_key_exists('status', $data)) {
            if ($data['status'] === 'completed') {
                $data['completed_at'] = $milestone->completed_at ?? now();
                $data['progress_percentage'] = 100;
            } else {
                $data['completed_at'] = null;

                if ((float) $milestone->progress_percentage === 100.0) {
                    $data['progress_percentage'] = 0;
                }
            }
        }

        $milestone->update($data);

        return response()->json([
            'message' => 'Cap nhat milestone thanh cong.',
            'data' => new MilestoneResource($milestone->fresh()->loadCount('tasks')),
        ]);
    }

    public function destroy(Milestone $milestone): Response
    {
        $this->authorize('delete', $milestone);

        $milestone->delete();

        return response()->noContent();
    }
}
