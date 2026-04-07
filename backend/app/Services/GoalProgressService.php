<?php

namespace App\Services;

use App\Models\Goal;
use App\Models\GoalLog;
use App\Models\Milestone;
use App\Models\Task;

class GoalProgressService
{
    public function syncFromTask(Task $task): void
    {
        $task->loadMissing(['milestone.goal', 'goal']);

        if ($task->milestone) {
            $this->syncMilestone($task->milestone, $task);

            return;
        }

        if ($task->goal) {
            $this->syncGoal($task->goal, null, $task);
        }
    }

    public function syncMilestone(Milestone $milestone, ?Task $task = null): float
    {
        /** @var Milestone $currentMilestone */
        $currentMilestone = $milestone->fresh() ?? $milestone;
        $currentMilestone->loadMissing('goal');

        $oldProgress = $this->normalizeProgress($currentMilestone->progress_percentage);
        $newProgress = $this->calculateMilestoneProgress($currentMilestone);

        if ($this->hasProgressChanged($oldProgress, $newProgress)) {
            $currentMilestone->update([
                'progress_percentage' => $newProgress,
            ]);

            $this->logProgressChange(
                goal: $currentMilestone->goal,
                milestone: $currentMilestone,
                task: $task,
                scope: 'milestone',
                oldProgress: $oldProgress,
                newProgress: $newProgress,
            );
        }

        if ($currentMilestone->goal) {
            $this->syncGoal($currentMilestone->goal, $currentMilestone, $task);
        }

        return $newProgress;
    }

    public function syncGoal(Goal $goal, ?Milestone $milestone = null, ?Task $task = null): float
    {
        /** @var Goal $currentGoal */
        $currentGoal = $goal->fresh() ?? $goal;

        $oldProgress = $this->normalizeProgress($currentGoal->progress_percentage);
        $newProgress = $this->calculateGoalProgress($currentGoal);

        if ($this->hasProgressChanged($oldProgress, $newProgress)) {
            $currentGoal->update([
                'progress_percentage' => $newProgress,
            ]);

            $this->logProgressChange(
                goal: $currentGoal,
                milestone: $milestone,
                task: $task,
                scope: 'goal',
                oldProgress: $oldProgress,
                newProgress: $newProgress,
            );
        }

        return $newProgress;
    }

    private function calculateMilestoneProgress(Milestone $milestone): float
    {
        $totalTasks = $milestone->tasks()->count();

        if ($totalTasks === 0) {
            return 0.0;
        }

        $completedTasks = $milestone->tasks()
            ->where('status', 'completed')
            ->count();

        return round(($completedTasks / $totalTasks) * 100, 2);
    }

    private function calculateGoalProgress(Goal $goal): float
    {
        $averageProgress = $goal->milestones()->avg('progress_percentage');

        return round((float) ($averageProgress ?? 0), 2);
    }

    private function hasProgressChanged(float $oldProgress, float $newProgress): bool
    {
        return abs($oldProgress - $newProgress) >= 0.01;
    }

    private function normalizeProgress(mixed $progress): float
    {
        return round((float) ($progress ?? 0), 2);
    }

    private function logProgressChange(
        ?Goal $goal,
        ?Milestone $milestone,
        ?Task $task,
        string $scope,
        float $oldProgress,
        float $newProgress
    ): void {
        if (! $goal) {
            return;
        }

        GoalLog::create([
            'user_id' => $goal->user_id,
            'goal_id' => $goal->id,
            'milestone_id' => $milestone?->id,
            'task_id' => $task?->id,
            'log_type' => 'progress_update',
            'title' => $scope === 'milestone'
                ? 'Cap nhat tien do milestone'
                : 'Cap nhat tien do goal',
            'content' => $this->buildProgressContent(
                goal: $goal,
                milestone: $milestone,
                task: $task,
                scope: $scope,
                oldProgress: $oldProgress,
                newProgress: $newProgress,
            ),
            'old_value' => [
                'scope' => $scope,
                'progress_percentage' => $oldProgress,
            ],
            'new_value' => [
                'scope' => $scope,
                'progress_percentage' => $newProgress,
            ],
            'progress_snapshot' => $newProgress,
            'logged_at' => now(),
        ]);
    }

    private function buildProgressContent(
        Goal $goal,
        ?Milestone $milestone,
        ?Task $task,
        string $scope,
        float $oldProgress,
        float $newProgress
    ): string {
        $taskContext = $task
            ? sprintf(' sau khi task "%s" thay doi', $task->title)
            : '';

        if ($scope === 'milestone' && $milestone) {
            return sprintf(
                'Tien do milestone "%s" trong goal "%s" thay doi tu %.2f%% len %.2f%%%s.',
                $milestone->title,
                $goal->title,
                $oldProgress,
                $newProgress,
                $taskContext,
            );
        }

        if ($milestone) {
            $taskPhrase = $task
                ? sprintf(' boi task "%s"', $task->title)
                : '';

            return sprintf(
                'Tien do goal "%s" thay doi tu %.2f%% len %.2f%% sau khi milestone "%s" duoc cap nhat%s.',
                $goal->title,
                $oldProgress,
                $newProgress,
                $milestone->title,
                $taskPhrase,
            );
        }

        return sprintf(
            'Tien do goal "%s" thay doi tu %.2f%% len %.2f%%%s.',
            $goal->title,
            $oldProgress,
            $newProgress,
            $taskContext,
        );
    }
}
