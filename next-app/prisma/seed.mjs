import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { hash } from "bcryptjs";

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(process.env["DATABASE_URL"])
});

const DEMO_PASSWORD = "Password123!";

function daysFromNow(days, hour = 9, minute = 0) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date;
}

function timeToday(hour, minute = 0) {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date;
}

async function clearDatabase() {
  await prisma.follow.deleteMany();
  await prisma.subtask.deleteMany();
  await prisma.pomodoroSession.deleteMany();
  await prisma.note.deleteMany();
  await prisma.goalLog.deleteMany();
  await prisma.habitLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.reminder.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.journalEntry.deleteMany();
  await prisma.task.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.project.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.goalTag.deleteMany();
  await prisma.goalCategory.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.goalTemplate.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.user.deleteMany();
}

async function createUsers() {
  const passwordHash = await hash(DEMO_PASSWORD, 12);

  const [alice, bob, carol] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Alice Nguyen",
        email: "alice@example.com",
        password: passwordHash,
        timezone: "Asia/Ho_Chi_Minh",
        locale: "vi",
        onboardingCompletedAt: daysFromNow(-14)
      }
    }),
    prisma.user.create({
      data: {
        name: "Bob Tran",
        email: "bob@example.com",
        password: passwordHash,
        timezone: "Asia/Ho_Chi_Minh",
        locale: "vi",
        onboardingCompletedAt: daysFromNow(-10)
      }
    }),
    prisma.user.create({
      data: {
        name: "Carol Le",
        email: "carol@example.com",
        password: passwordHash,
        timezone: "Asia/Ho_Chi_Minh",
        locale: "vi",
        onboardingCompletedAt: daysFromNow(-7)
      }
    })
  ]);

  return { alice, bob, carol };
}

async function createAliceWorkspace(alice) {
  const [careerCategory, healthCategory, deepWorkTag, nextjsTag, financeTag] =
    await Promise.all([
      prisma.category.create({
        data: {
          userId: alice.id,
          name: "Career",
          slug: "career",
          color: "#0f172a",
          icon: "briefcase",
          type: "GOAL"
        }
      }),
      prisma.category.create({
        data: {
          userId: alice.id,
          name: "Health",
          slug: "health",
          color: "#15803d",
          icon: "heart",
          type: "ALL"
        }
      }),
      prisma.tag.create({
        data: {
          userId: alice.id,
          name: "deep-work",
          color: "#2563eb"
        }
      }),
      prisma.tag.create({
        data: {
          userId: alice.id,
          name: "nextjs",
          color: "#111827"
        }
      }),
      prisma.tag.create({
        data: {
          userId: alice.id,
          name: "finance",
          color: "#16a34a"
        }
      })
    ]);

  const publicGoal = await prisma.goal.create({
    data: {
      userId: alice.id,
      categoryId: careerCategory.id,
      title: "Ship full-stack Next.js migration",
      slug: "ship-full-stack-nextjs-migration",
      description:
        "Hoan thanh viec chuyen doi du an cu sang Next.js full-stack voi App Router, Prisma va Auth.js.",
      goalType: "MID_TERM",
      priority: "HIGH",
      status: "IN_PROGRESS",
      progressPercentage: 68,
      startDate: daysFromNow(-20),
      targetDate: daysFromNow(21),
      successMetric: "Toan bo flow chinh chay o he moi",
      note: "Goal cong khai de phuc vu module follow.",
      isPublic: true,
      tagLinks: {
        create: [{ tagId: deepWorkTag.id }, { tagId: nextjsTag.id }]
      }
    }
  });

  const privateGoal = await prisma.goal.create({
    data: {
      userId: alice.id,
      categoryId: healthCategory.id,
      title: "Build sustainable daily system",
      slug: "build-sustainable-daily-system",
      description:
        "On dinh thoi quen suc khoe, journaling va review hang tuan de tang do ben.",
      goalType: "LONG_TERM",
      priority: "MEDIUM",
      status: "IN_PROGRESS",
      progressPercentage: 34,
      startDate: daysFromNow(-30),
      targetDate: daysFromNow(90),
      note: "Goal rieng tu de test privacy state.",
      isPublic: false,
      tagLinks: {
        create: [{ tagId: financeTag.id }]
      }
    }
  });

  const [milestoneOne, milestoneTwo] = await Promise.all([
    prisma.milestone.create({
      data: {
        userId: alice.id,
        goalId: publicGoal.id,
        title: "Foundation and auth",
        description:
          "Dung schema Prisma, auth credentials va protected app shell.",
        status: "COMPLETED",
        progressPercentage: 100,
        startDate: daysFromNow(-18),
        targetDate: daysFromNow(-8),
        completedAt: daysFromNow(-8, 18, 0),
        sequenceNo: 1,
        note: "Phase 1 -> 4 da xong."
      }
    }),
    prisma.milestone.create({
      data: {
        userId: alice.id,
        goalId: publicGoal.id,
        title: "Feature migration and social",
        description:
          "Migrate goals, tasks, habits, notes, notifications, projects va follow.",
        status: "IN_PROGRESS",
        progressPercentage: 62,
        startDate: daysFromNow(-7),
        targetDate: daysFromNow(21),
        sequenceNo: 2,
        note: "Dang can seed va test hardening."
      }
    })
  ]);

  const migrationProject = await prisma.project.create({
    data: {
      userId: alice.id,
      goalId: publicGoal.id,
      name: "Next.js core migration",
      description:
        "Gom cac task lien quan den migration, auth, dashboard va social follow.",
      status: "ACTIVE",
      color: "#f97316",
      startDate: daysFromNow(-12),
      endDate: daysFromNow(18),
      progressPercentage: 70
    }
  });

  const [taskOne, taskTwo, taskThree] = await Promise.all([
    prisma.task.create({
      data: {
        userId: alice.id,
        goalId: publicGoal.id,
        milestoneId: milestoneOne.id,
        projectId: migrationProject.id,
        title: "Set up Auth.js credentials",
        description:
          "Dang ky, dang nhap, session guard va route protection cho app moi.",
        status: "COMPLETED",
        priority: "HIGH",
        progressPercentage: 100,
        dueAt: daysFromNow(-11, 17, 0),
        startedAt: daysFromNow(-13, 9, 0),
        completedAt: daysFromNow(-12, 16, 30),
        estimatedMinutes: 180,
        actualMinutes: 220,
        isFocus: true,
        sortOrder: 1
      }
    }),
    prisma.task.create({
      data: {
        userId: alice.id,
        goalId: publicGoal.id,
        milestoneId: milestoneTwo.id,
        projectId: migrationProject.id,
        title: "Wire projects and subtasks",
        description:
          "Gan project vao task, hien subtasks checklist va sync progress project.",
        status: "IN_PROGRESS",
        priority: "HIGH",
        progressPercentage: 65,
        dueAt: daysFromNow(2, 16, 0),
        startedAt: daysFromNow(-2, 8, 30),
        estimatedMinutes: 240,
        actualMinutes: 130,
        isFocus: true,
        sortOrder: 2
      }
    }),
    prisma.task.create({
      data: {
        userId: alice.id,
        goalId: publicGoal.id,
        milestoneId: milestoneTwo.id,
        projectId: migrationProject.id,
        title: "Seed local demo database",
        description:
          "Tao seed Prisma cho toan bo module da migrate de bootstrap local va staging.",
        status: "NOT_STARTED",
        priority: "CRITICAL",
        progressPercentage: 0,
        dueAt: daysFromNow(4, 14, 0),
        estimatedMinutes: 120,
        isFocus: false,
        sortOrder: 3
      }
    })
  ]);

  await prisma.subtask.createMany({
    data: [
      {
        taskId: taskTwo.id,
        name: "Map projectId into task form",
        status: "COMPLETED",
        completedAt: daysFromNow(-1, 10, 30),
        sortOrder: 1
      },
      {
        taskId: taskTwo.id,
        name: "Render subtasks panel on tasks page",
        status: "COMPLETED",
        completedAt: daysFromNow(-1, 14, 15),
        sortOrder: 2
      },
      {
        taskId: taskTwo.id,
        name: "Sync project progress after task update",
        status: "IN_PROGRESS",
        sortOrder: 3
      },
      {
        taskId: taskThree.id,
        name: "Seed auth users and categories",
        status: "PENDING",
        sortOrder: 1
      },
      {
        taskId: taskThree.id,
        name: "Seed social follow data",
        status: "PENDING",
        sortOrder: 2
      }
    ]
  });

  const learningHabit = await prisma.habit.create({
    data: {
      userId: alice.id,
      goalId: privateGoal.id,
      title: "Read and review architecture notes",
      description:
        "Moi ngay danh 30 phut doc lai notes va rut ra 1 cai thien can lam.",
      frequency: "DAILY",
      targetCount: 1,
      unit: "session",
      reminderTime: timeToday(20, 30),
      currentStreak: 4,
      bestStreak: 7,
      lastLoggedAt: daysFromNow(0, 21, 0),
      status: "ACTIVE",
      startDate: daysFromNow(-10)
    }
  });

  await prisma.habitLog.createMany({
    data: [
      {
        userId: alice.id,
        habitId: learningHabit.id,
        logDate: daysFromNow(-3),
        completedCount: 1,
        targetCountSnapshot: 1,
        isCompleted: true,
        note: "Doc lai phan auth va middleware."
      },
      {
        userId: alice.id,
        habitId: learningHabit.id,
        logDate: daysFromNow(-2),
        completedCount: 1,
        targetCountSnapshot: 1,
        isCompleted: true,
        note: "Review flow projects va subtasks."
      },
      {
        userId: alice.id,
        habitId: learningHabit.id,
        logDate: daysFromNow(-1),
        completedCount: 1,
        targetCountSnapshot: 1,
        isCompleted: true,
        note: "Doc notes ve server actions."
      },
      {
        userId: alice.id,
        habitId: learningHabit.id,
        logDate: daysFromNow(0),
        completedCount: 1,
        targetCountSnapshot: 1,
        isCompleted: true,
        note: "Tong hop phase 10 va plan tiep theo."
      }
    ]
  });

  await prisma.goalLog.createMany({
    data: [
      {
        userId: alice.id,
        goalId: publicGoal.id,
        milestoneId: milestoneOne.id,
        taskId: taskOne.id,
        logType: "COMPLETION",
        title: "Hoan thanh auth foundation",
        content: "Credentials login va route protection da chay tren app moi.",
        progressSnapshot: 45,
        loggedAt: daysFromNow(-12, 16, 45)
      },
      {
        userId: alice.id,
        goalId: publicGoal.id,
        milestoneId: milestoneTwo.id,
        taskId: taskTwo.id,
        logType: "PROGRESS_UPDATE",
        title: "Projects va subtasks da len he moi",
        content: "Tasks page va goal detail da hien checklist va project chip.",
        progressSnapshot: 68,
        loggedAt: daysFromNow(-1, 18, 0)
      }
    ]
  });

  await prisma.note.createMany({
    data: [
      {
        userId: alice.id,
        noteableType: "GOAL",
        noteableId: publicGoal.id,
        content: "Can tiep tuc lam seed + hardening truoc khi cutover staging."
      },
      {
        userId: alice.id,
        noteableType: "TASK",
        noteableId: taskThree.id,
        content: "Seed phai co tai khoan demo, public goals va pomodoro sample."
      },
      {
        userId: alice.id,
        noteableType: "HABIT",
        noteableId: learningHabit.id,
        content: "Habit nay giup giai quyet debt ve review kien truc moi."
      }
    ]
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: alice.id,
        type: "goal.progress",
        title: "Goal migration dang o 68%",
        body: "Milestone social follow da xong, tiep theo la seed va test.",
        relatedType: "GOAL",
        relatedId: publicGoal.id
      },
      {
        userId: alice.id,
        type: "task.deadline",
        title: "Seed local demo database sap den han",
        body: "Task seed can hoan thanh trong 4 ngay toi.",
        relatedType: "TASK",
        relatedId: taskThree.id
      }
    ]
  });

  await prisma.pomodoroSession.createMany({
    data: [
      {
        userId: alice.id,
        taskId: taskTwo.id,
        startedAt: daysFromNow(-1, 9, 0),
        endedAt: daysFromNow(-1, 9, 25),
        durationMinutes: 25,
        completed: true,
        notes: "Xong luong subtasks panel"
      },
      {
        userId: alice.id,
        taskId: taskTwo.id,
        startedAt: daysFromNow(0, 8, 30),
        durationMinutes: 25,
        completed: false
      }
    ]
  });

  await prisma.reminder.create({
    data: {
      userId: alice.id,
      remindableType: "TASK",
      remindableId: taskThree.id,
      title: "Hoan thanh seed truoc review",
      message: "Can co seed de demo full flow trong buoi review.",
      remindAt: daysFromNow(1, 8, 0),
      channel: "IN_APP",
      status: "PENDING"
    }
  });

  await prisma.journalEntry.create({
    data: {
      userId: alice.id,
      goalId: publicGoal.id,
      entryDate: daysFromNow(0),
      title: "Daily engineering log",
      content:
        "Hom nay da chot phase social follow va bat dau chuan hoa seed cho local bootstrap.",
      moodScore: 8,
      energyScore: 7,
      productivityScore: 8,
      blockers: "Chua co migration DB that cho is_public",
      wins: "Module follows da hoat dong.",
      nextSteps: "Viet seed + smoke test."
    }
  });

  await prisma.goalTemplate.create({
    data: {
      userId: alice.id,
      categoryId: careerCategory.id,
      name: "Launch a product migration",
      description: "Template goal cho cac du an refactor va cutover.",
      goalType: "MID_TERM",
      estimatedDurationDays: 45,
      templatePayload: {
        milestones: ["Foundation", "Feature migration", "Seed and hardening"]
      },
      isPublic: true
    }
  });

  await prisma.attachment.create({
    data: {
      userId: alice.id,
      attachableType: "GOAL",
      attachableId: publicGoal.id,
      disk: "local",
      path: "demo/migration-playbook.pdf",
      originalName: "migration-playbook.pdf",
      mimeType: "application/pdf",
      fileSize: BigInt(245760)
    }
  });

  return {
    publicGoal,
    privateGoal
  };
}

async function createBobWorkspace(bob, publicGoalId) {
  const [personalCategory, consistencyTag] = await Promise.all([
    prisma.category.create({
      data: {
        userId: bob.id,
        name: "Personal",
        slug: "personal",
        color: "#7c3aed",
        icon: "sparkles",
        type: "ALL"
      }
    }),
    prisma.tag.create({
      data: {
        userId: bob.id,
        name: "consistency",
        color: "#9333ea"
      }
    })
  ]);

  const bobGoal = await prisma.goal.create({
    data: {
      userId: bob.id,
      categoryId: personalCategory.id,
      title: "Keep weekly review ritual",
      slug: "keep-weekly-review-ritual",
      description:
        "Duy tri review hang tuan de khong bi truot khoi muc tieu quan trong.",
      goalType: "SHORT_TERM",
      priority: "MEDIUM",
      status: "IN_PROGRESS",
      progressPercentage: 52,
      startDate: daysFromNow(-8),
      targetDate: daysFromNow(20),
      note: "Public goal de Alice/Carol co the follow.",
      isPublic: true,
      tagLinks: {
        create: [{ tagId: consistencyTag.id }]
      }
    }
  });

  await prisma.follow.create({
    data: {
      followerId: bob.id,
      followableType: "GOAL",
      followableId: publicGoalId
    }
  });

  await prisma.notification.create({
    data: {
      userId: bob.id,
      type: "social.following",
      title: "Ban dang follow mot public goal",
      body: "Goal migration cua Alice se xuat hien trong trang Follows.",
      relatedType: "GOAL",
      relatedId: publicGoalId
    }
  });

  return { bobGoal };
}

async function createCarolWorkspace(carol, bobGoalId) {
  await prisma.follow.create({
    data: {
      followerId: carol.id,
      followableType: "GOAL",
      followableId: bobGoalId
    }
  });

  await prisma.user.update({
    where: {
      id: carol.id
    },
    data: {
      lastActiveAt: daysFromNow(0, 7, 45)
    }
  });
}

async function main() {
  console.log("Resetting database...");
  await clearDatabase();

  console.log("Creating demo users...");
  const { alice, bob, carol } = await createUsers();

  console.log("Seeding Alice workspace...");
  const { publicGoal, privateGoal } = await createAliceWorkspace(alice);

  console.log("Seeding Bob workspace...");
  const { bobGoal } = await createBobWorkspace(bob, publicGoal.id);

  console.log("Seeding Carol workspace...");
  await createCarolWorkspace(carol, bobGoal.id);

  console.log("");
  console.log("Seed completed successfully.");
  console.log(`Demo password: ${DEMO_PASSWORD}`);
  console.log("Accounts:");
  console.log("  alice@example.com");
  console.log("  bob@example.com");
  console.log("  carol@example.com");
  console.log("");
  console.log(`Alice public goal id: ${publicGoal.id.toString()}`);
  console.log(`Alice private goal id: ${privateGoal.id.toString()}`);
  console.log(`Bob public goal id: ${bobGoal.id.toString()}`);
}

main()
  .catch((error) => {
    console.error("Seed failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
