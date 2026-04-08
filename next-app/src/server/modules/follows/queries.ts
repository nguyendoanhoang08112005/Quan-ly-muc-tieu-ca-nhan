import "server-only";

import type { Prisma } from "@prisma/client";
import {
  clampProgress,
  goalPriorityFromPrisma,
  goalStatusFromPrisma,
  goalTypeFromPrisma
} from "@/features/goals/goal-helpers";
import type { FollowGoalListItem, FollowOverview } from "@/features/follows/types";
import { getPrismaClient } from "@/lib/db/prisma";
import { formatDateInput } from "@/lib/dates";

const followGoalSelect = {
  id: true,
  title: true,
  description: true,
  goalType: true,
  priority: true,
  status: true,
  progressPercentage: true,
  targetDate: true,
  user: {
    select: {
      id: true,
      name: true
    }
  },
  category: {
    select: {
      id: true,
      name: true,
      color: true,
      icon: true,
      deletedAt: true
    }
  },
  tagLinks: {
    select: {
      tag: {
        select: {
          id: true,
          name: true,
          color: true,
          deletedAt: true
        }
      }
    }
  },
  _count: {
    select: {
      tasks: {
        where: {
          deletedAt: null
        }
      },
      milestones: {
        where: {
          deletedAt: null
        }
      }
    }
  }
} satisfies Prisma.GoalSelect;

function toNumber(value: number | { toNumber(): number } | null | undefined) {
  if (value === null || value === undefined) {
    return 0;
  }

  return typeof value === "number" ? value : value.toNumber();
}

function mapFollowGoal(
  goal: Prisma.GoalGetPayload<{ select: typeof followGoalSelect }>,
  options: {
    followedAt: string | null;
    followerCount: number;
    isFollowed: boolean;
  }
): FollowGoalListItem {
  const category =
    goal.category && !goal.category.deletedAt
      ? {
          id: goal.category.id.toString(),
          name: goal.category.name,
          color: goal.category.color ?? null,
          icon: goal.category.icon ?? null
        }
      : null;
  const tags = goal.tagLinks
    .filter((tagLink) => !tagLink.tag.deletedAt)
    .map((tagLink) => ({
      id: tagLink.tag.id.toString(),
      name: tagLink.tag.name,
      color: tagLink.tag.color ?? null
    }));

  return {
    id: goal.id.toString(),
    title: goal.title,
    description: goal.description ?? "",
    goalType: goalTypeFromPrisma[goal.goalType],
    priority: goalPriorityFromPrisma[goal.priority],
    status: goalStatusFromPrisma[goal.status],
    progress: clampProgress(toNumber(goal.progressPercentage)),
    targetDate: formatDateInput(goal.targetDate),
    owner: {
      id: goal.user.id.toString(),
      name: goal.user.name
    },
    category,
    tags,
    tasksCount: goal._count.tasks,
    milestonesCount: goal._count.milestones,
    followerCount: options.followerCount,
    isFollowed: options.isFollowed,
    followedAt: options.followedAt
  };
}

async function getGoalFollowerCountMap(goalIds: bigint[]) {
  const prisma = getPrismaClient();

  if (goalIds.length === 0) {
    return new Map<string, number>();
  }

  const grouped = await prisma.follow.groupBy({
    by: ["followableId"],
    where: {
      followableType: "GOAL",
      followableId: {
        in: goalIds
      }
    },
    _count: {
      _all: true
    }
  });

  return new Map(
    grouped.map((item) => [item.followableId.toString(), item._count._all])
  );
}

export async function getFollowOverviewForUser(
  userId: bigint
): Promise<FollowOverview> {
  const prisma = getPrismaClient();
  const follows = await prisma.follow.findMany({
    where: {
      followerId: userId,
      followableType: "GOAL"
    },
    orderBy: {
      createdAt: "desc"
    },
    select: {
      followableId: true,
      createdAt: true
    }
  });
  const followedGoalIds = follows.map((follow) => follow.followableId);

  const [followedGoals, discoverGoals] = await Promise.all([
    followedGoalIds.length > 0
      ? prisma.goal.findMany({
          where: {
            id: {
              in: followedGoalIds
            },
            deletedAt: null,
            isPublic: true
          },
          select: followGoalSelect
        })
      : [],
    prisma.goal.findMany({
      where: {
        userId: {
          not: userId
        },
        deletedAt: null,
        isPublic: true,
        ...(followedGoalIds.length > 0
          ? {
              id: {
                notIn: followedGoalIds
              }
            }
          : {})
      },
      orderBy: [{ updatedAt: "desc" }, { targetDate: "asc" }],
      take: 18,
      select: followGoalSelect
    })
  ]);

  const allGoalIds = [...followedGoals, ...discoverGoals].map((goal) => goal.id);
  const followerCountMap = await getGoalFollowerCountMap(allGoalIds);
  const followedMeta = new Map(
    follows.map((follow) => [
      follow.followableId.toString(),
      follow.createdAt.toISOString()
    ])
  );
  const followedGoalsById = new Map(
    followedGoals.map((goal) => [goal.id.toString(), goal])
  );

  return {
    followedGoals: follows
      .map((follow) => {
        const goal = followedGoalsById.get(follow.followableId.toString());

        if (!goal) {
          return null;
        }

        return mapFollowGoal(goal, {
          isFollowed: true,
          followedAt: followedMeta.get(goal.id.toString()) ?? null,
          followerCount: followerCountMap.get(goal.id.toString()) ?? 0
        });
      })
      .filter((goal): goal is FollowGoalListItem => goal !== null),
    discoverGoals: discoverGoals.map((goal) =>
      mapFollowGoal(goal, {
        isFollowed: false,
        followedAt: null,
        followerCount: followerCountMap.get(goal.id.toString()) ?? 0
      })
    )
  };
}
