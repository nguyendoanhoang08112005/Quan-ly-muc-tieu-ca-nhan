# Legacy Data Import

Script nay phuc vu viec chuyen du lieu tu database Laravel cu sang schema Prisma moi.

## Pham vi hien tai

Script import duoc cac bang co migration that trong he Laravel cu:

- `users`
- `password_reset_tokens`
- `categories`
- `tags`
- `goals`
- `milestones`
- `tasks`
- `goal_tag`
- `goal_logs`

Nhung domain mo rong nhu `habits`, `notes`, `notifications`, `pomodoro_sessions`,
`projects`, `subtasks`, `follows` hien chua co migration Laravel tuong ung trong repo,
nen script se chi bao cao la khong tim thay bang nguon va bo qua.

## Bien moi truong can co

```env
DATABASE_URL="mysql://root:password@localhost:3306/next_target_db"
LEGACY_DATABASE_URL="mysql://root:password@localhost:3306/legacy_laravel_db"
```

## Cach chay

Dry run:

```bash
npm run legacy:plan
```

Ghi that vao DB moi:

```bash
npm run legacy:import -- --write
```

Sau khi import xong, reconcile lai cac truong derive nhu progress, streak va
`completedAt`:

```bash
npm run legacy:reconcile -- --write
```

Neu target da co du lieu va ban muon merge chu khong yeu cau DB rong:

```bash
npm run legacy:import -- --write --allow-non-empty-target
```

Import mot nhom bang cu the:

```bash
npm run legacy:import -- --write --tables=users,categories,tags,goals
```

Chi reconcile mot nhom scope cu the:

```bash
npm run legacy:reconcile -- --write --scopes=goals,milestones,habits
```

## Nguyen tac an toan

- `dry run` la mac dinh
- script tu choi chay `--write` neu `LEGACY_DATABASE_URL` va `DATABASE_URL` giong nhau
- script tu choi ghi vao target khong rong, tru khi co `--allow-non-empty-target`
- script giu nguyen `id` cu de khong vo relation
- bang nao khong ton tai o legacy DB se duoc log va skip
- `legacy:reconcile` cung mac dinh la `dry run`, chi ghi that khi truyen `--write`
- reconcile se:
  - tinh lai `goals.progressPercentage`
  - tinh lai `milestones.progressPercentage`
  - tinh lai `projects.progressPercentage`
  - chuan hoa `completedAt` cho `tasks`, `subtasks`, `milestones`, `goals`
  - tinh lai `currentStreak`, `bestStreak`, `lastLoggedAt` cho `habits`
