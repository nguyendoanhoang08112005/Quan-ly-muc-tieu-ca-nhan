import type { Route } from "next";
import { GoalForm } from "@/features/goals/components/goal-form";

export default function NewGoalPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <GoalForm cancelHref={"/goals" as Route} mode="create" />
      </div>
    </div>
  );
}
