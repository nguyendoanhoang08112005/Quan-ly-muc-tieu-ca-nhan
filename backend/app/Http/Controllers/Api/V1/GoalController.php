<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGoalRequest;
use App\Http\Requests\UpdateGoalRequest;
use App\Http\Resources\GoalResource;
use App\Models\Goal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GoalController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Goal::class, 'goal');
    }

    public function index(Request $request)
    {
        $goals = $request->user()
            ->goals()
            ->withCount(['tasks', 'milestones'])
            ->latest()
            ->get();

        return GoalResource::collection($goals);
    }

    public function store(StoreGoalRequest $request): JsonResponse
    {
        $goal = Goal::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
            'slug' => $this->makeSlug($request->string('title')->toString()),
            'progress_percentage' => $request->input('status') === 'completed' ? 100 : 0,
            'completed_at' => $request->input('status') === 'completed' ? now() : null,
        ]);

        return response()->json([
            'message' => 'Tao muc tieu thanh cong.',
            'data' => new GoalResource($goal->fresh()->loadCount(['tasks', 'milestones'])),
        ], 201);
    }

    public function show(Goal $goal): GoalResource
    {
        $goal->loadCount(['tasks', 'milestones']);

        return new GoalResource($goal);
    }

    public function update(UpdateGoalRequest $request, Goal $goal): JsonResponse
    {
        $data = $request->validated();

        if (array_key_exists('title', $data)) {
            $data['slug'] = $this->makeSlug($data['title'], $goal->id);
        }

        if (array_key_exists('status', $data)) {
            if ($data['status'] === 'completed') {
                $data['completed_at'] = $goal->completed_at ?? now();
                $data['progress_percentage'] = 100;
            } else {
                $data['completed_at'] = null;

                if ($goal->progress_percentage == 100) {
                    $data['progress_percentage'] = 0;
                }
            }
        }

        $goal->update($data);
        return response()->json([
            'message' => 'Cap nhat muc tieu thanh cong.',
            'data' => new GoalResource($goal->fresh()->loadCount(['tasks', 'milestones'])),
        ]);
    }

    public function destroy(Goal $goal): Response
    {
        $goal->delete();

        return response()->noContent();
    }

    private function makeSlug(string $title, ?int $ignoreGoalId = null): string
    {
        $baseSlug = Str::slug($title);
        $slug = $baseSlug !== '' ? $baseSlug : Str::random(8);
        $counter = 1;

        while (
            Goal::query()
                ->when($ignoreGoalId, fn ($query) => $query->where('id', '!=', $ignoreGoalId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $baseSlug.'-'.$counter;
            $counter++;
        }

        return $slug;
    }
}
