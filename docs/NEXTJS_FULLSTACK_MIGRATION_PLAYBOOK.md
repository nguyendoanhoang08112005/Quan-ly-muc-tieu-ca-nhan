# Kế hoạch chuyển đổi toàn bộ dự án sang Next.js Full-stack

Ngày cập nhật: `2026-04-07`

## 1. Mục tiêu tài liệu

Tài liệu này là playbook thi công để chuyển toàn bộ dự án hiện tại từ kiến trúc:

- `frontend/`: React + CRA + React Router + Axios
- `backend/`: Laravel 12 + Sanctum + Eloquent + MySQL

sang kiến trúc mới:

- `Next.js App Router`
- `TypeScript strict`
- `Tailwind CSS + Shadcn UI`
- `Auth.js`
- `Prisma + MySQL`
- `Server Components + Server Actions + Route Handlers`

Mục tiêu của lần chuyển đổi này là:

- Giữ lại toàn bộ chức năng cũ đang có trong codebase.
- Không migrate kiểu dịch tay `1:1` từ Laravel/CRA sang Next.js.
- Tái cấu trúc theo tư duy `server-first`, `schema-first`, `validation-first`.
- Ghi rõ cả các module đang chạy thật, các module legacy, và các module còn dang dở nhưng đã tồn tại trong model/seeder/docs hiện tại.

Tài liệu này không chỉ mô tả roadmap cấp cao. Nó là checklist triển khai chi tiết để có thể làm từng bước mà không bỏ sót chức năng nào cũ.

---

## 2. Kiểm kê hiện trạng codebase

### 2.1 Stack hiện tại

#### Frontend hiện tại

- `Create React App`
- `React 18`
- `TypeScript`
- `React Router`
- `Axios`
- `Tailwind CSS`
- `@dnd-kit/*`
- Auth lưu token trong `localStorage`

Nguồn chính:

- `frontend/package.json`
- `frontend/src/App.tsx`
- `frontend/src/contexts/AuthContext.tsx`

#### Backend hiện tại

- `Laravel 12`
- `PHP 8.2`
- `Laravel Sanctum`
- `Eloquent ORM`
- `MySQL`
- REST API qua `/api/v1/*`

Nguồn chính:

- `backend/composer.json`
- `backend/routes/api.php`
- `backend/app/Http/Controllers/Api/V1/*`

---

### 2.2 Chức năng đang active end-to-end

Các chức năng dưới đây đang có UI thật và API thật:

| Module | Frontend | Backend | Trạng thái |
| --- | --- | --- | --- |
| Landing/Home | Có | Không cần | Đang dùng |
| Đăng ký | Có | Có | Đang dùng |
| Đăng nhập | Có | Có | Đang dùng |
| Đăng xuất | Có | Có | Đang dùng |
| Lấy user hiện tại | Có | Có | Đang dùng |
| Dashboard summary | Có | Có | Đang dùng |
| Goal list | Có | Có | Đang dùng |
| Goal create | Có | Có | Đang dùng |
| Goal detail | Có | Có | Đang dùng |
| Milestone create/list trong goal detail | Có | Có | Đang dùng |
| Task create/complete trong goal detail | Có | Có | Đang dùng |

Nguồn chính:

- `frontend/src/routes/Home.tsx`
- `frontend/src/components/Login.tsx`
- `frontend/src/components/Register.tsx`
- `frontend/src/routes/Dashboard.tsx`
- `frontend/src/routes/Goals.tsx`
- `frontend/src/routes/GoalCreate.tsx`
- `frontend/src/routes/GoalDetail.tsx`
- `backend/routes/api.php`

---

### 2.3 Các route frontend hiện tại

| Route | File hiện tại | Mô tả |
| --- | --- | --- |
| `/` | `frontend/src/routes/Home.tsx` | Landing page giới thiệu scope active/tạm đóng băng |
| `/login` | `frontend/src/components/Login.tsx` | Form đăng nhập |
| `/register` | `frontend/src/components/Register.tsx` | Form đăng ký |
| `/dashboard` | `frontend/src/routes/Dashboard.tsx` | Dashboard cá nhân |
| `/goals` | `frontend/src/routes/Goals.tsx` | Danh sách goal |
| `/goals/new` | `frontend/src/routes/GoalCreate.tsx` | Tạo goal |
| `/goals/:goalId` | `frontend/src/routes/GoalDetail.tsx` | Chi tiết goal, milestone, task |
| `/tasks` | redirect | Hiện chưa có tasks page thật |

Lưu ý quan trọng:

- Dự án hiện có route `/tasks` nhưng chưa có trang task độc lập thật.
- Task hiện chỉ xuất hiện lồng trong `GoalDetail`.
- Điều này ảnh hưởng trực tiếp đến kế hoạch migrate: trong Next.js nên xây luôn `tasks/page.tsx` thật để thay thế redirect tạm.

---

### 2.4 Các API backend hiện tại đang chạy

| Method | Endpoint | Controller | Chức năng |
| --- | --- | --- | --- |
| `POST` | `/api/register` | `AuthController@register` | Alias cũ |
| `POST` | `/api/login` | `AuthController@login` | Alias cũ |
| `POST` | `/api/logout` | `AuthController@logout` | Alias cũ có auth |
| `GET` | `/api/user` | `AuthController@me` | Alias cũ có auth |
| `GET` | `/api/goals` | `GoalController@index` | Alias cũ có auth |
| `POST` | `/api/v1/auth/register` | `AuthController@register` | Đăng ký |
| `POST` | `/api/v1/auth/login` | `AuthController@login` | Đăng nhập |
| `POST` | `/api/v1/auth/logout` | `AuthController@logout` | Đăng xuất |
| `GET` | `/api/v1/auth/me` | `AuthController@me` | User hiện tại |
| `PATCH` | `/api/v1/profile` | `ProfileController@update` | Cập nhật profile |
| `GET` | `/api/v1/dashboard/summary` | `DashboardController@summary` | Dashboard summary |
| `GET` | `/api/v1/goals` | `GoalController@index` | Danh sách goal |
| `POST` | `/api/v1/goals` | `GoalController@store` | Tạo goal |
| `GET` | `/api/v1/goals/{goal}` | `GoalController@show` | Chi tiết goal |
| `PATCH` | `/api/v1/goals/{goal}` | `GoalController@update` | Cập nhật goal |
| `DELETE` | `/api/v1/goals/{goal}` | `GoalController@destroy` | Xóa goal |
| `GET` | `/api/v1/goals/{goal}/milestones` | `MilestoneController@index` | Danh sách milestone theo goal |
| `POST` | `/api/v1/goals/{goal}/milestones` | `MilestoneController@store` | Tạo milestone |
| `GET` | `/api/v1/milestones/{milestone}` | `MilestoneController@show` | Chi tiết milestone |
| `PATCH` | `/api/v1/milestones/{milestone}` | `MilestoneController@update` | Cập nhật milestone |
| `DELETE` | `/api/v1/milestones/{milestone}` | `MilestoneController@destroy` | Xóa milestone |
| `POST` | `/api/v1/milestones/{milestone}/tasks` | `TaskController@store` | Tạo task trong milestone |
| `GET` | `/api/v1/tasks/{task}` | `TaskController@show` | Chi tiết task |
| `PATCH` | `/api/v1/tasks/{task}` | `TaskController@update` | Cập nhật task |
| `DELETE` | `/api/v1/tasks/{task}` | `TaskController@destroy` | Xóa task |
| `PATCH` | `/api/v1/tasks/{task}/complete` | `TaskController@complete` | Complete task nhanh |

---

### 2.5 Domain model đang tồn tại trong backend

#### Nhóm có migration và đang dùng thật

| Model | Có migration | Có API | Có UI | Ghi chú |
| --- | --- | --- | --- | --- |
| `User` | Có | Có | Có | Auth, profile |
| `Category` | Có | Chưa | Chưa | Schema đã có nhưng chưa có flow UI/API |
| `Tag` | Có | Chưa | Chưa | Schema đã có nhưng chưa có flow UI/API |
| `Goal` | Có | Có | Có | Domain trung tâm |
| `Milestone` | Có | Có | Có | Nằm trong goal detail |
| `Task` | Có | Có | Có | Nằm trong goal detail |
| `GoalLog` | Có | Dùng nội bộ | Chưa | Ghi log progress tự động |
| `PersonalAccessToken` | Có | Nội bộ | Không | Sanctum cũ |

#### Nhóm có model/seeder/factory nhưng chưa có migration đồng bộ trong repo hiện tại

| Model | Có model | Có seeder/factory | Có migration trong repo | Trạng thái |
| --- | --- | --- | --- | --- |
| `Note` | Có | Có | Không thấy | Dang dở |
| `Habit` | Có | Có | Không thấy | Dang dở |
| `HabitLog` | Có | Có | Không thấy | Dang dở |
| `Notification` | Có | Có | Không thấy | Dang dở |
| `PomodoroSession` | Có | Có | Không thấy | Dang dở |
| `Project` | Có | Có | Không thấy | Legacy |
| `Subtask` | Có | Có | Không thấy | Legacy |
| `Follow` | Có | Có | Không thấy | Legacy/social |

Kết luận rất quan trọng:

- Codebase hiện tại không chỉ có `auth -> goals -> tasks`.
- Nó còn có nhiều domain cũ hoặc domain dự định mở rộng nhưng chưa hoàn tất schema/API/UI.
- Khi chuyển sang Next.js, không được bỏ sót các domain này. Phải ghi rõ một trong hai hướng:
  - migrate thật;
  - hoặc đánh dấu retire/deprecate có chủ đích và có tài liệu.

---

### 2.6 Các chức năng frontend legacy chưa đi qua flow active hiện tại

#### Legacy UI đã có nhưng chưa còn là flow chính

| Thành phần | File | Chức năng cũ |
| --- | --- | --- |
| `GoalList` | `frontend/src/components/GoalList.tsx` | Goal grid, search, filter status, filter priority, edit, delete |
| `CreateGoal` | `frontend/src/components/CreateGoal.tsx` | Modal create/edit goal kiểu cũ |
| `TaskBoard` | `frontend/src/components/TaskBoard.tsx` | Board kéo thả task bằng local state |
| `TaskColumn` | `frontend/src/components/TaskColumn.tsx` | Cột task board |
| `TaskCard` | `frontend/src/components/TaskCard.tsx` | Card task cho drag-drop board |

Các thành phần trên không được xóa khỏi kế hoạch migrate. Chúng phải được phân loại:

- hoặc tái sinh thành module Next.js thật;
- hoặc archive có tài liệu nếu quyết định bỏ.

---

### 2.7 Hạ tầng và hành vi kỹ thuật hiện tại cần được thay thế

| Thành phần cũ | Hiện trạng | Cần thay bằng |
| --- | --- | --- |
| `BrowserRouter` | SPA client-side | `App Router` |
| `ProtectedRoute` client | Gate ở client | Gate ở server bằng `auth()` + middleware/layout |
| `AuthContext + localStorage token` | Token lưu localStorage | `Auth.js` session cookie |
| `Axios + useEffect` | Fetch sau mount | `Server Components` + `Server Actions` |
| `FormRequest` Laravel | Validation backend | `Zod` dùng chung cho server/client |
| `Policy` Laravel | Ownership check | Server guard trong actions/services |
| `API Resource` Laravel | Serialize response | DTO/mapper typed trong server layer |
| `Eloquent` | ORM cũ | `Prisma` |
| CRA build vào `backend/public/app` | Coupling cũ | Next.js app độc lập rồi cutover |

---

## 3. Vấn đề và rủi ro phải xử lý trước khi migrate

### 3.1 Rủi ro kiến trúc

- Frontend và backend đang tách rời hoàn toàn nên nhiều logic bị phân mảnh.
- `Dashboard`, `Goals`, `GoalDetail` đều đang fetch bằng `useEffect`, gây chậm first paint và không tận dụng SSR.
- `Auth` đang phụ thuộc `localStorage`, không phù hợp với App Router server-first.
- Có cả component active và legacy song song, dễ gây migrate trùng hoặc bỏ sót.

### 3.2 Rủi ro schema/domain

- Các model `Note`, `Habit`, `Notification`, `PomodoroSession`, `Project`, `Subtask`, `Follow` có mặt trong code nhưng chưa thấy migration tương ứng trong repo.
- Một số seeder/factory đang tham chiếu field không còn tồn tại hoặc không khớp schema active hiện tại:
  - `FollowSeeder` và `FollowFactory` dùng `goal.is_public`.
  - `NoteSeeder` dùng `task.project_id`, `task.assignee_id`, `goal.name`.
  - `PomodoroSessionFactory` dùng `task.assignee_id` và `task.project`.
- Điều này cho thấy trước khi migrate sang Prisma phải có bước chuẩn hóa domain thật rõ ràng.

### 3.3 Rủi ro test

- Backend test hiện chỉ có `ExampleTest`.
- Frontend test hiện chỉ có `App.test.js` rất cơ bản.
- Không có contract test cho auth, goal, milestone, task.

### 3.4 Rủi ro cutover

- Laravel đang serve CRA build qua `backend/routes/web.php`.
- Nếu chuyển sang Next.js quá sớm mà chưa có staging song song, nguy cơ downtime cao.

---

## 4. Kiến trúc mục tiêu sau khi chuyển sang Next.js

## 4.1 Chiến lược migrate an toàn

Khuyến nghị không sửa trực tiếp `frontend/` hoặc `backend/` để biến chúng thành Next.js.

Nên làm theo hướng:

1. Tạo app mới song song, ví dụ `next-app/` hoặc `apps/web/`.
2. Giữ `frontend/` và `backend/` ở trạng thái chỉ đọc trong thời gian migrate.
3. Hoàn thành đủ flow trong Next.js.
4. Chạy staging song song.
5. Cutover.
6. Archive code cũ.

Khuyến nghị thư mục mục tiêu:

```txt
next-app/
  src/
    app/
      (public)/
      (auth)/
      (app)/
      api/
    components/
    features/
    lib/
    server/
    hooks/
    types/
  prisma/
  public/
  tests/
  middleware.ts
  next.config.ts
  package.json
```

---

## 4.2 Cấu trúc thư mục đích chi tiết

```txt
next-app/
  src/
    app/
      (public)/
        page.tsx
      (auth)/
        login/page.tsx
        register/page.tsx
      (app)/
        layout.tsx
        dashboard/page.tsx
        goals/
          page.tsx
          new/page.tsx
          [goalId]/
            page.tsx
            edit/page.tsx
        milestones/
          page.tsx
        tasks/
          page.tsx
          board/page.tsx
        categories/
          page.tsx
        tags/
          page.tsx
        notes/
          page.tsx
        habits/
          page.tsx
        notifications/
          page.tsx
        pomodoro/
          page.tsx
        projects/
          page.tsx
        follows/
          page.tsx
        settings/
          profile/page.tsx
      api/
        auth/
          [...nextauth]/
            route.ts
        v1/
          goals/route.ts
          tasks/route.ts
          milestones/route.ts
          categories/route.ts
          tags/route.ts
          habits/route.ts
          notifications/route.ts

    components/
      ui/
      layout/
      forms/
      shared/
      charts/

    features/
      auth/
      dashboard/
      goals/
      milestones/
      tasks/
      categories/
      tags/
      notes/
      habits/
      notifications/
      pomodoro/
      projects/
      follows/

    lib/
      auth/
      db/
      validations/
      constants/
      utils/
      permissions/

    server/
      modules/
        auth/
        dashboard/
        goals/
        milestones/
        tasks/
        categories/
        tags/
        notes/
        habits/
        notifications/
        pomodoro/
        projects/
        follows/
      services/
      repositories/
      mappers/

  prisma/
    schema.prisma
    migrations/
    seed.ts

  tests/
    unit/
    integration/
    e2e/
```

---

## 4.3 Nguyên tắc Server/Client bắt buộc

### Giữ là Server Component

- `page.tsx` của dashboard
- `page.tsx` của goals list
- `page.tsx` của goal detail
- các section summary
- layout kiểm tra session
- các component chỉ hiển thị dữ liệu

### Dùng Client Component khi thật sự cần

- form
- modal
- dropdown
- drag-drop task board
- habit tracker tương tác
- pomodoro timer
- toast

### Dùng Server Actions cho mutation nội bộ

- tạo/cập nhật/xóa goal
- tạo/cập nhật/xóa milestone
- tạo/cập nhật/xóa task
- complete task
- update profile
- create note
- habit log

### Dùng Route Handlers khi cần API thật

- `Auth.js`
- public API / integration API
- webhook
- mobile client trong tương lai

---

## 5. Bảng mapping từ hệ cũ sang hệ mới

| Hệ cũ | Hệ mới |
| --- | --- |
| `frontend/src/App.tsx` + React Router | `src/app/*` App Router |
| `ProtectedRoute` | server auth gate trong layout/middleware |
| `AuthContext` | `Auth.js` |
| Sanctum bearer token | session cookie |
| `backend/app/Http/Requests/*` | `src/lib/validations/*.ts` dùng `Zod` |
| `backend/app/Policies/*` | server-side ownership guard |
| `backend/app/Services/*` | `src/server/modules/*` + services |
| `backend/app/Http/Resources/*` | typed mapper/serializer |
| `Eloquent Model` | `Prisma model` |
| `useEffect` data fetching | fetch trong Server Component |
| `Axios client everywhere` | chỉ dùng ở client nếu thật sự cần |

---

## 6. Danh sách chức năng cũ phải được theo dõi trong quá trình migrate

## 6.1 Auth và profile

- [ ] Đăng ký tài khoản
- [ ] Đăng nhập
- [ ] Đăng xuất
- [ ] Lấy thông tin user hiện tại
- [ ] Cập nhật profile
- [ ] Validate email hợp lệ
- [ ] Validate password tối thiểu 8 ký tự
- [ ] Xác nhận password khi đăng ký
- [ ] Redirect nếu đã đăng nhập
- [ ] Chặn route private nếu chưa đăng nhập
- [ ] Hiển thị loading auth
- [ ] Hiển thị error auth
- [ ] Bỏ hoàn toàn cơ chế `localStorage token`

## 6.2 Public pages và điều hướng

- [ ] Landing page `/`
- [ ] Public navigation
- [ ] Sidebar private
- [ ] CTA vào dashboard
- [ ] Empty state/intro state
- [ ] Redirect `*`
- [ ] Quy tắc hiển thị navigation theo route

## 6.3 Dashboard

- [ ] Summary card: active goals
- [ ] Summary card: completed goals
- [ ] Summary card: tasks today
- [ ] Summary card: overdue tasks
- [ ] Danh sách active goals
- [ ] Danh sách upcoming tasks
- [ ] Quick actions
- [ ] Empty state dashboard
- [ ] Tính toán theo timezone user

## 6.4 Goals

- [ ] List goals
- [ ] Create goal
- [ ] Detail goal
- [ ] Update goal
- [ ] Delete goal
- [ ] Generate slug
- [ ] Goal type
- [ ] Priority
- [ ] Status
- [ ] Start date
- [ ] Target date
- [ ] Note
- [ ] Progress
- [ ] Task count
- [ ] Milestone count
- [ ] Empty state goals
- [ ] Legacy search goal
- [ ] Legacy filter status
- [ ] Legacy filter priority
- [ ] Legacy goal edit modal
- [ ] Legacy goal delete menu
- [ ] Giữ schema cho `success_metric`
- [ ] Giữ schema cho `outcome_note`
- [ ] Giữ schema cho `is_archived`
- [ ] Giữ schema cho `is_recurring`
- [ ] Giữ schema cho `recurrence_rule`
- [ ] Giữ schema cho `sort_order`
- [ ] Category gắn với goal
- [ ] Tags gắn với goal

## 6.5 Milestones

- [ ] List milestone theo goal
- [ ] Create milestone
- [ ] Show milestone
- [ ] Update milestone
- [ ] Delete milestone
- [ ] Sequence number
- [ ] Status
- [ ] Progress
- [ ] Start date
- [ ] Target date
- [ ] Note
- [ ] Task count
- [ ] Empty state milestone

## 6.6 Tasks

- [ ] Create task trong milestone
- [ ] Show task
- [ ] Update task
- [ ] Delete task
- [ ] Complete task nhanh
- [ ] Status
- [ ] Priority
- [ ] Progress
- [ ] Due date
- [ ] Started at
- [ ] Completed at
- [ ] Estimated minutes
- [ ] Actual minutes
- [ ] Focus task
- [ ] Sort order
- [ ] Metadata
- [ ] Hiển thị task trong goal detail
- [ ] Empty state task theo milestone
- [ ] Legacy task board local-state
- [ ] Legacy kéo thả task board
- [ ] Xây tasks page thật thay cho redirect `/tasks`

## 6.7 Categories và tags

- [ ] CRUD category
- [ ] Category type: `goal`, `task`, `all`
- [ ] CRUD tag
- [ ] Gắn tag vào goal
- [ ] Gắn category vào goal
- [ ] Xem danh sách category
- [ ] Xem danh sách tag

## 6.8 Goal logs

- [ ] Ghi log khi progress goal thay đổi
- [ ] Ghi log khi progress milestone thay đổi
- [ ] Ghi log từ task làm ảnh hưởng goal/milestone
- [ ] Lưu `old_value`
- [ ] Lưu `new_value`
- [ ] Lưu `progress_snapshot`
- [ ] Lưu `logged_at`
- [ ] Có UI xem log goal

## 6.9 Notes

- [ ] Goal note
- [ ] Task note
- [ ] Polymorphic noteable
- [ ] Notes page hoặc notes panel
- [ ] Tạo note
- [ ] Sửa note
- [ ] Xóa note

## 6.10 Habits

- [ ] Habit CRUD
- [ ] Habit frequency: daily/weekly/monthly
- [ ] Habit target count
- [ ] Current streak
- [ ] Best streak
- [ ] Active/inactive habit
- [ ] Habit gắn goal
- [ ] Habit page
- [ ] Habit cards

## 6.11 Habit logs

- [ ] Log habit theo ngày
- [ ] Đánh dấu completed
- [ ] Ghi notes cho habit log
- [ ] Tính streak lại sau khi log
- [ ] Lịch sử 7 ngày gần nhất
- [ ] Calendar/log list

## 6.12 Notifications

- [ ] Notification center
- [ ] Notification list
- [ ] Related polymorphic entity
- [ ] Mark as read
- [ ] Unread count
- [ ] Recent notifications

## 6.13 Pomodoro

- [ ] Start session
- [ ] End session
- [ ] Complete session
- [ ] Duration minutes
- [ ] Notes cho session
- [ ] Link với task
- [ ] Pomodoro page/widget

## 6.14 Projects

- [ ] Giữ module project khỏi thất lạc
- [ ] Xác định relation với goal
- [ ] Project CRUD
- [ ] Project progress
- [ ] Project status
- [ ] Project start/end date
- [ ] Project tasks relation nếu còn cần

## 6.15 Subtasks

- [ ] Giữ module subtasks khỏi thất lạc
- [ ] Subtask CRUD
- [ ] Mark completed
- [ ] Mark pending
- [ ] Relation với task

## 6.16 Follow/social

- [ ] Giữ module follow khỏi thất lạc
- [ ] Follower relation
- [ ] Polymorphic followable
- [ ] Follow goal
- [ ] Unfollow
- [ ] Làm rõ `is_public` hoặc cơ chế chia sẻ

## 6.17 Seeder, factory, test, infra

- [ ] Seed user
- [ ] Seed goal
- [ ] Seed milestone
- [ ] Seed task
- [ ] Seed legacy modules còn giữ
- [ ] Factory/test data tương đương
- [ ] Unit test
- [ ] Integration test
- [ ] E2E test
- [ ] Staging deploy

---

## 7. Kế hoạch thi công chi tiết theo phase

## Phase 0 - Khóa phạm vi và đóng băng code cũ

### Mục tiêu

Đảm bảo chúng ta migrate có kiểm soát, không vừa migrate vừa tiếp tục thay đổi flow cũ.

### Việc phải làm

1. Tạo branch migration riêng.
2. Khóa `frontend/` và `backend/` thành nguồn tham chiếu.
3. Chụp inventory cuối cùng của:
   - routes
   - API
   - models
   - migrations
   - seeders
   - factories
   - UI active
   - UI legacy
4. Xác định module nào:
   - migrate ngay
   - migrate ở wave sau
   - deprecate có tài liệu
5. Chốt tên thư mục app Next.js mới.

### Done khi

- Có tài liệu inventory.
- Có quyết định rõ cho từng module legacy.
- Không còn mơ hồ module nào bị quên.

---

## Phase 1 - Khởi tạo Next.js mới

### Mục tiêu

Dựng khung Next.js full-stack song song với hệ cũ.

### Việc phải làm

1. Tạo app Next.js mới với:
   - App Router
   - TypeScript strict
   - ESLint
   - Tailwind CSS
2. Cài package nền:
   - `next`
   - `react`
   - `react-dom`
   - `typescript`
   - `zod`
   - `react-hook-form`
   - `@hookform/resolvers`
   - `next-auth` hoặc `auth.js`
   - `@auth/prisma-adapter`
   - `prisma`
   - `@prisma/client`
   - `bcryptjs`
   - `shadcn/ui`
   - `sonner`
   - `lucide-react`
   - `date-fns` hoặc `dayjs`
   - `@dnd-kit/*`
3. Bật alias path.
4. Tạo folder structure đích.
5. Tạo `src/app/(public)`, `src/app/(auth)`, `src/app/(app)`.
6. Tạo `error.tsx`, `loading.tsx`, `not-found.tsx`.
7. Tạo `middleware.ts`.

### Done khi

- Next app boot được.
- Có App Router layout cơ bản.
- Có strict mode và lint chạy được.

---

## Phase 2 - Thiết kế lại database bằng Prisma

### Mục tiêu

Chuyển toàn bộ schema cần giữ sang Prisma mà không làm mất domain cũ.

### Bảng phải có ở Prisma ngay từ đầu

#### Bảng lõi chắc chắn phải có

- `User`
- `Goal`
- `Milestone`
- `Task`
- `Category`
- `Tag`
- `GoalTag`
- `GoalLog`

#### Bảng auth cho Auth.js

- `Account`
- `Session`
- `VerificationToken`
- `Authenticator` nếu phiên bản Auth.js/adaptor yêu cầu

#### Bảng legacy hoặc dang dở nhưng phải quyết định rõ

- `Note`
- `Habit`
- `HabitLog`
- `Notification`
- `PomodoroSession`
- `Project`
- `Subtask`
- `Follow`

### Việc phải làm

1. Đọc toàn bộ migration cũ.
2. Đọc toàn bộ model cũ.
3. Lập bảng mapping field cũ -> field mới.
4. Lập danh sách field có rủi ro mất dữ liệu.
5. Thiết kế enum Prisma:
   - `GoalType`
   - `GoalPriority`
   - `GoalStatus`
   - `MilestoneStatus`
   - `TaskStatus`
   - `CategoryType`
   - `HabitFrequency`
   - `GoalLogType`
6. Quyết định chiến lược cho field mâu thuẫn:
   - field còn dùng
   - field bỏ
   - field legacy giữ tạm
7. Viết `schema.prisma`.
8. Chạy migration local.
9. Tạo `seed.ts`.

### Điểm phải khóa

- `Task` vẫn phải giữ cả `goalId` và `milestoneId`.
- `Goal` phải giữ `categoryId`.
- `Goal` phải giữ `slug`.
- `Goal` phải giữ các field nền móng như `successMetric`, `outcomeNote`, `isArchived`, `isRecurring`, `recurrenceRule`, `sortOrder`.
- `GoalLog` phải được giữ vì hiện tại progress service đã phụ thuộc.

### Done khi

- Prisma schema biểu diễn được toàn bộ domain cần giữ.
- Migrate chạy sạch.
- Seed cơ bản chạy được.

---

## Phase 3 - Thiết lập Auth.js

### Mục tiêu

Thay auth kiểu Sanctum token/localStorage bằng session cookie an toàn hơn, phù hợp App Router.

### Việc phải làm

1. Thiết lập Auth.js với `Credentials`.
2. Dùng `PrismaAdapter` nếu chọn database session.
3. Tạo hàm `auth()` dùng chung ở server.
4. Tạo `signIn`, `signOut`.
5. Tạo validation Zod cho:
   - register
   - login
   - update profile
6. Hash password bằng `bcryptjs`.
7. Tạo server actions:
   - `registerAction`
   - `loginAction`
   - `logoutAction`
   - `updateProfileAction`
8. Tạo middleware hoặc layout guard cho route private.
9. Migrate logic:
   - redirect nếu đã login
   - redirect nếu chưa login
10. Bỏ hoàn toàn localStorage token.

### Tương đương chức năng cũ cần giữ

- `register`
- `login`
- `logout`
- `me`
- `update profile`
- loading auth
- auth redirect

### Done khi

- Có thể đăng ký, đăng nhập, đăng xuất.
- Session đọc được cả server và client.
- Route private được bảo vệ ở server.

---

## Phase 4 - App shell, layout, UI foundations

### Mục tiêu

Dựng khung giao diện nền để các module nghiệp vụ bám vào.

### Việc phải làm

1. Tạo `PublicLayout`.
2. Tạo `AuthLayout`.
3. Tạo `AppLayout`.
4. Migrate `Navigation`.
5. Migrate `Sidebar`.
6. Dựng các primitive bằng Shadcn:
   - button
   - dialog
   - form
   - input
   - textarea
   - select
   - dropdown menu
   - badge
   - toast
   - skeleton
7. Tạo pattern loading và error đồng nhất.
8. Tạo theme variables.

### Done khi

- Có shell private tương đương hệ cũ.
- Có public nav.
- Có sidebar có thể mở rộng cho module mới.

---

## Phase 5 - Migrate public pages

### Chức năng cần migrate

- Landing page `/`
- Login page
- Register page
- Public navigation

### Việc phải làm

1. Chuyển `Home.tsx` thành `src/app/(public)/page.tsx`.
2. Chuyển login/register sang route App Router.
3. Đưa metadata cho landing page.
4. Chuyển redirect logic cũ vào server.

### Done khi

- Route public hoạt động end-to-end.
- Không còn phụ thuộc React Router.

---

## Phase 6 - Migrate profile

### Chức năng cần migrate

- Xem profile user hiện tại
- Cập nhật name/email/timezone/locale/avatar_path

### Việc phải làm

1. Tạo `settings/profile/page.tsx`.
2. Tạo `ProfileForm`.
3. Tạo `updateProfileAction`.
4. Thêm validation Zod tương đương `UpdateProfileRequest`.
5. Đồng bộ UI với session sau update.

### Done khi

- User cập nhật được profile bằng server action.

---

## Phase 7 - Migrate Goals module

### Phạm vi migrate

- Goals list
- Create goal
- Goal detail
- Update goal
- Delete goal
- Search/filter/edit/delete từ legacy component

### Việc phải làm

1. Tạo `goals/page.tsx` dạng Server Component.
2. Tạo `goals/new/page.tsx`.
3. Tạo `goals/[goalId]/page.tsx`.
4. Tạo `goals/[goalId]/edit/page.tsx` hoặc edit dialog.
5. Tạo `GoalForm` mới bằng React Hook Form + Zod.
6. Tạo server actions:
   - `createGoal`
   - `updateGoal`
   - `deleteGoal`
7. Di chuyển logic slug sang server module.
8. Tạo query layer cho:
   - list goals
   - get goal detail
9. Migrate đủ field schema của goal.
10. Tích hợp category/tag nếu đã sẵn sàng schema.
11. Migrate legacy search/filter từ `GoalList.tsx`.
12. Migrate delete confirmation.

### Các field goal phải giữ

- `title`
- `description`
- `goalType`
- `priority`
- `status`
- `startDate`
- `targetDate`
- `completedAt`
- `successMetric`
- `outcomeNote`
- `note`
- `isArchived`
- `isRecurring`
- `recurrenceRule`
- `sortOrder`
- `slug`
- `categoryId`

### Done khi

- Goal CRUD hoàn chỉnh trên Next.js.
- List, detail, edit, delete đều chạy.
- Search/filter từ legacy không bị mất.

---

## Phase 8 - Migrate Milestones module

### Phạm vi migrate

- List milestone theo goal
- Create milestone
- Show milestone
- Update milestone
- Delete milestone
- Sequence/reorder

### Việc phải làm

1. Tạo milestone query trong server module.
2. Tạo `MilestoneForm`.
3. Tạo server actions:
   - `createMilestone`
   - `updateMilestone`
   - `deleteMilestone`
4. Migrate validation tương đương `StoreMilestoneRequest` và `UpdateMilestoneRequest`.
5. Giữ `sequenceNo`.
6. Sau mỗi mutation phải sync progress goal.
7. Tạo UI edit milestone.
8. Tạo UI delete milestone.
9. Nếu cần, thêm reorder milestone.

### Done khi

- Goal detail hiển thị milestone từ server.
- Milestone CRUD hoàn chỉnh.

---

## Phase 9 - Migrate Tasks module

### Phạm vi migrate

- Create task
- Show task
- Update task
- Delete task
- Complete task
- Task list theo milestone
- Tasks page riêng
- Legacy task board kéo thả

### Việc phải làm

1. Tạo task query/service layer.
2. Tạo `TaskForm`.
3. Tạo server actions:
   - `createTask`
   - `updateTask`
   - `deleteTask`
   - `completeTask`
   - `reorderTask`
4. Migrate validation tương đương `StoreTaskRequest` và `UpdateTaskRequest`.
5. Sync progress goal/milestone sau mỗi mutation.
6. Tạo `tasks/page.tsx` thật.
7. Chuyển `TaskBoard` demo thành board thật:
   - query task theo status
   - kéo thả cập nhật status/sort order
   - optimistic UI
8. Tạo filter task:
   - theo status
   - theo priority
   - theo overdue
   - theo focus
   - theo goal
9. Tạo task detail drawer/page nếu cần.

### Các field task phải giữ

- `title`
- `description`
- `status`
- `priority`
- `progressPercentage`
- `dueAt`
- `startedAt`
- `completedAt`
- `estimatedMinutes`
- `actualMinutes`
- `isFocus`
- `sortOrder`
- `metadata`
- `goalId`
- `milestoneId`

### Done khi

- Task không còn chỉ sống lồng trong `GoalDetail`.
- Có tasks page độc lập.
- Board kéo thả là dữ liệu thật thay vì local state demo.

---

## Phase 10 - Migrate Dashboard module

### Phạm vi migrate

- Summary cards
- Active goals
- Upcoming tasks
- Empty state
- Quick actions

### Việc phải làm

1. Tạo `dashboard/page.tsx` là Server Component.
2. Port logic `DashboardService` sang server module.
3. Giữ tính toán theo timezone user.
4. Tối ưu query:
   - active goals count
   - completed goals count
   - tasks today
   - overdue tasks
   - top active goals
   - upcoming tasks 7 ngày
5. Tạo skeleton/loading.
6. Tạo empty state.

### Done khi

- Dashboard không còn `useEffect`.
- Dữ liệu render server-side.

---

## Phase 11 - Migrate Categories, Tags và Goal Logs

### Categories

1. Tạo Prisma model và CRUD server actions.
2. Tạo UI quản lý category.
3. Hỗ trợ `type = goal | task | all`.

### Tags

1. Tạo Prisma model và CRUD server actions.
2. Tạo UI quản lý tag.
3. Tạo UI gắn tags cho goal.

### Goal Logs

1. Port `GoalProgressService` sang server service mới.
2. Ghi log khi:
   - progress milestone thay đổi
   - progress goal thay đổi
   - task complete/update ảnh hưởng goal
3. Tạo tab timeline/log ở goal detail.

### Done khi

- Goal có category/tag/log đầy đủ.

---

## Phase 12 - Migrate Notes

### Vì sao phase này bắt buộc phải có

`Note` đã tồn tại trong model, factory, seeder. Nếu bỏ qua sẽ làm thất lạc một domain cũ của dự án.

### Việc phải làm

1. Thiết kế Prisma model `Note`.
2. Chốt quan hệ polymorphic theo hướng Prisma-friendly:
   - phương án A: `entityType + entityId`
   - phương án B: tách `goalNotes`, `taskNotes`
3. Tạo CRUD notes.
4. Tạo notes panel ở goal/task.
5. Tạo notes page tổng hợp nếu cần.

### Done khi

- Goal note và task note có nơi sống rõ ràng.

---

## Phase 13 - Migrate Habits và Habit Logs

### Vì sao phase này bắt buộc phải có

`Habit` và `HabitLog` đã có model, seeder, factory và còn được nhắc rõ trong tài liệu sản phẩm.

### Việc phải làm

1. Tạo Prisma model `Habit`.
2. Tạo Prisma model `HabitLog`.
3. Port logic streak.
4. Tạo actions:
   - create habit
   - update habit
   - archive/inactive habit
   - log today
   - update log
5. Tạo page `habits`.
6. Tạo habit cards và history view.

### Done khi

- Habit tracker hoạt động với dữ liệu thật.

---

## Phase 14 - Migrate Notifications

### Vì sao phase này bắt buộc phải có

`Notification` đã tồn tại trong model, factory, seeder.

### Việc phải làm

1. Tạo Prisma model notification.
2. Tạo notification center.
3. Tạo unread badge.
4. Tạo action mark as read.
5. Gắn related entity link.

### Done khi

- Notification center hoạt động với dữ liệu thật.

---

## Phase 15 - Migrate Pomodoro

### Vì sao phase này bắt buộc phải có

`PomodoroSession` đã tồn tại trong model, factory, seeder.

### Việc phải làm

1. Tạo Prisma model pomodoro session.
2. Tạo timer client component.
3. Tạo server actions:
   - start session
   - stop session
   - complete session
4. Gắn với task.
5. Tạo widget trong task detail hoặc trang riêng.

### Done khi

- Session pomodoro được lưu bền vững.

---

## Phase 16 - Migrate Projects

### Vì sao phải ghi rõ

`Project` là legacy domain. Không active trong flow hiện tại nhưng có model, factory, seeder.

### Quyết định bắt buộc trước khi code

Phải chọn một trong hai:

1. Giữ như một module độc lập và migrate thật.
2. Deprecate chính thức, có script export dữ liệu và tài liệu archive.

### Nếu giữ

1. Tạo Prisma model project.
2. Tạo project CRUD.
3. Làm rõ project-task relation hiện đại.
4. Làm rõ relation với goal.

### Nếu retire

1. Viết tài liệu retire.
2. Tạo script dump dữ liệu cũ.
3. Xóa link khỏi UI mới.
4. Giữ read-only archive.

### Done khi

- Không còn trạng thái lửng lơ của module project.

---

## Phase 17 - Migrate Subtasks

### Vì sao phải ghi rõ

`Subtask` là legacy domain, có model, factory, seeder.

### Việc phải làm nếu giữ

1. Tạo Prisma model subtask.
2. Tạo relation task -> subtasks.
3. Tạo UI checklist subtasks.
4. Tạo complete/pending actions.

### Nếu retire

1. Viết tài liệu retire.
2. Có mapping dữ liệu sang task checklist hoặc note.

---

## Phase 18 - Migrate Follow/Social

### Vì sao phải ghi rõ

`Follow` có model, seeder, factory và đang ngầm phụ thuộc vào field `goal.is_public` không còn rõ ràng trong schema active.

### Việc phải làm

1. Quyết định xem có thật sự giữ social follow không.
2. Nếu giữ:
   - thêm `isPublic` hoặc cơ chế share rõ ràng cho `Goal`
   - tạo Prisma model follow
   - tạo follow/unfollow actions
   - tạo policy ownership/privacy
3. Nếu retire:
   - ghi rõ retire trong docs
   - archive factory/seeder

### Done khi

- Không còn domain social mập mờ.

---

## Phase 19 - Data migration và seed

### Mục tiêu

Chuyển dữ liệu cũ sang schema Prisma mà không mất quan hệ.

### Việc phải làm

1. Tạo mapping dữ liệu từng bảng.
2. Export dữ liệu từ MySQL hiện tại.
3. Import vào schema Prisma mới.
4. Xử lý relation:
   - users -> goals
   - goals -> milestones
   - goals/milestones -> tasks
   - goals -> tags
   - goals/tasks -> notes
   - habits -> habitLogs
5. Recalculate progress sau import.
6. Viết seed mới thay cho toàn bộ seed cũ lỗi thời.
7. Loại bỏ seeder/factory tham chiếu field không tồn tại.

### Các seeder/factory cần review kỹ vì đang sai lệch

- `FollowSeeder`
- `NoteSeeder`
- `PomodoroSessionFactory`
- `ProjectSeeder`
- `SubtaskSeeder`

### Done khi

- Có thể bootstrap local/staging bằng seed Prisma sạch.

---

## Phase 20 - Testing và hardening

### Unit tests tối thiểu

- auth validation
- goal validation
- milestone validation
- task validation
- progress calculation
- streak calculation
- permission guards

### Integration tests tối thiểu

- register/login/logout
- update profile
- create/update/delete goal
- create/update/delete milestone
- create/update/delete/complete task
- dashboard summary
- notes CRUD
- habit log
- notification read

### E2E tối thiểu

- user đăng ký -> đăng nhập -> tạo goal -> thêm milestone -> thêm task -> complete task -> xem dashboard
- tạo goal bằng category/tag
- edit/delete goal
- board task kéo thả

### Performance/hardening

- SSR dashboard
- cache hợp lý
- tránh N+1 query
- metadata/SEO cho public pages
- error boundary
- audit auth redirect

---

## Phase 21 - Staging, cutover và dọn hệ cũ

### Việc phải làm

1. Deploy Next.js app lên staging.
2. Cấu hình env staging.
3. Chạy smoke test toàn bộ flow.
4. Chốt ngày freeze dữ liệu nếu cần.
5. Chạy migration dữ liệu cuối.
6. Trỏ traffic sang Next.js.
7. Giữ Laravel + CRA ở chế độ read-only một thời gian.
8. Sau khi ổn định:
   - archive `frontend/`
   - archive `backend/`
   - xóa build cũ `backend/public/app`
   - bỏ fallback SPA trong `backend/routes/web.php`

### Done khi

- Next.js trở thành nguồn chạy chính.
- Code cũ được archive an toàn.

---

## 8. Thứ tự triển khai khuyến nghị để không tự làm khó

Thứ tự nên làm:

1. Phase 0
2. Phase 1
3. Phase 2
4. Phase 3
5. Phase 4
6. Phase 5
7. Phase 6
8. Phase 7
9. Phase 8
10. Phase 9
11. Phase 10
12. Phase 11
13. Phase 12
14. Phase 13
15. Phase 14
16. Phase 15
17. Phase 16
18. Phase 17
19. Phase 18
20. Phase 19
21. Phase 20
22. Phase 21

Không nên làm ngược thứ tự này, vì:

- chưa có schema thì không nên build feature thật;
- chưa có auth ổn thì protected pages sẽ vỡ;
- chưa có task/milestone chuẩn thì dashboard sẽ méo dữ liệu;
- chưa rõ legacy module giữ hay bỏ thì dễ mất dữ liệu cũ.

---

## 9. Danh sách quyết định bắt buộc phải chốt trước khi bắt tay code

- [ ] Tên thư mục app Next.js mới
- [ ] Giữ `Project` hay retire
- [ ] Giữ `Subtask` hay retire
- [ ] Giữ `Follow` hay retire
- [ ] `Auth.js` dùng database session hay JWT session
- [ ] Có migrate `Category` và `Tag` ngay từ wave đầu hay wave thứ hai
- [ ] `Notes` dùng polymorphic mềm hay tách bảng riêng
- [ ] `Task board` sẽ là route `/tasks/board` hay tích hợp luôn vào `/tasks`
- [ ] Có giữ alias REST `/api/v1/*` để tương thích ngoài web app hay chỉ dùng Server Actions nội bộ

---

## 10. Kết luận thi công

Đây không phải một lần "chuyển frontend sang Next.js" đơn giản. Đây là một lần:

- gom lại toàn bộ domain đang rời rạc;
- dựng lại auth theo chuẩn server-first;
- tái tổ chức data flow từ client fetch sang server fetch;
- chuẩn hóa schema và validation;
- quyết toán các module legacy đang nửa sống nửa ngủ trong repo.

Nguyên tắc xuyên suốt:

1. Không bỏ sót module cũ.
2. Không dịch code cũ 1:1.
3. Không giữ localStorage auth.
4. Không tiếp tục để task chỉ sống dưới goal detail.
5. Không để các model/seeder legacy tiếp tục tồn tại mà không có quyết định rõ ràng.

Khi bắt đầu thi công thật, nên đi ngay theo nhịp:

1. dựng `next-app/`
2. chốt `schema.prisma`
3. dựng `Auth.js`
4. migrate `Goals -> Milestones -> Tasks -> Dashboard`
5. quay lại kéo toàn bộ module legacy còn lại vào hoặc retire có tài liệu

