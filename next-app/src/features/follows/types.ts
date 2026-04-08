import type {
  GoalCategorySummary,
  GoalPriority,
  GoalStatus,
  GoalTagSummary,
  GoalType
} from "@/features/goals/types";

export type FollowGoalListItem = {
  id: string;
  title: string;
  description: string;
  goalType: GoalType;
  priority: GoalPriority;
  status: GoalStatus;
  progress: number;
  targetDate: string | null;
  owner: {
    id: string;
    name: string;
  };
  category: GoalCategorySummary | null;
  tags: GoalTagSummary[];
  tasksCount: number;
  milestonesCount: number;
  followerCount: number;
  isFollowed: boolean;
  followedAt: string | null;
};

export type FollowOverview = {
  discoverGoals: FollowGoalListItem[];
  followedGoals: FollowGoalListItem[];
};
