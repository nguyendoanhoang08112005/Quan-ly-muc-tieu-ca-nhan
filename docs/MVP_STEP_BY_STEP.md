# Kế hoạch MVP siêu đơn giản: làm từ bước 1 đến bước 12

## Cách dùng file này
- Chỉ làm từ trên xuống dưới.
- Chưa xong bước hiện tại thì không sang bước tiếp theo.
- Nếu bị rối, quay lại kiểm tra xem mình đang ở bước nào.
- File này chỉ tập trung vào MVP, chưa bàn đến AI, gamification, Google Calendar, export nâng cao.

## Mục tiêu cuối cùng của MVP
Khi xong file này, hệ thống phải làm được đúng luồng sau:
1. user đăng ký hoặc đăng nhập
2. user tạo goal
3. user tạo milestone
4. user tạo task
5. user hoàn thành task
6. progress tự cập nhật
7. user xem được dashboard cơ bản

---

## Bước 1: Dọn lại dự án

### Bạn cần làm gì
- Xác định rõ dự án này chỉ làm `quản lý mục tiêu cá nhân`.
- Tạm bỏ qua các phần không liên quan như:
  - `projects`
  - `subtasks` cũ
  - `productApi`
  - `follow`
  - các màn hình demo cũ không thuộc flow chính

### Mục đích của bước này
Để codebase chỉ còn tập trung vào thứ mình đang xây.

### Xong bước này khi nào
- Bạn biết rõ module nào dùng, module nào không dùng.
- Repo không còn gây hiểu nhầm là đang làm nhiều loại sản phẩm khác nhau.

### Chưa được làm tiếp
- Chưa làm dashboard đẹp.
- Chưa làm habit.
- Chưa làm report.

---

## Bước 2: Chốt công nghệ và cấu trúc thư mục

### Bạn cần làm gì
- Giữ backend là `Laravel + Sanctum + MySQL`.
- Giữ frontend là `React + TypeScript + TSX`.
- Tạo cấu trúc thư mục rõ ràng:
  - frontend:
    - `features`
    - `components/ui`
    - `components/layout`
    - `lib/api`
  - backend:
    - `Controllers/Api/V1`
    - `Requests`
    - `Resources`
    - `Policies`
    - `Services`

### Mục đích của bước này
Để sau này thêm code không bị nhét lung tung.

### Xong bước này khi nào
- Backend có folder API v1.
- Frontend có folder feature-based cơ bản.

### Chưa được làm tiếp
- Chưa code business logic sâu khi chưa chốt chỗ đặt file.

---

## Bước 3: Làm database chuẩn

### Bạn cần làm gì
- Tạo hoặc refactor migration cho các bảng:
  - `users`
  - `goals`
  - `milestones`
  - `tasks`
  - `categories`
  - `tags`
  - `goal_logs`
- Nếu còn thời gian trong bước này thì thêm:
  - `habits`
  - `habit_logs`
  - `reminders`
  - `journal_entries`

### Cần nhớ
- `goals -> milestones -> tasks` là trục chính.
- `tasks` phải có `goal_id` và `milestone_id`.
- Các bảng nghiệp vụ phải có `user_id`.

### Mục đích của bước này
Vì backend và frontend đều phụ thuộc vào data model.

### Xong bước này khi nào
- `php artisan migrate:fresh` chạy thành công.
- Mở DB ra thấy schema đúng như mình muốn làm.

### Chưa được làm tiếp
- Chưa làm API nếu schema còn chưa chốt.

---

## Bước 4: Tạo model và relation

### Bạn cần làm gì
- Tạo model:
  - `Goal`
  - `Milestone`
  - `Task`
  - `Category`
  - `Tag`
  - `GoalLog`
- Khai báo relation:
  - User có nhiều Goal
  - Goal có nhiều Milestone
  - Milestone có nhiều Task
  - Goal có nhiều Task

### Mục đích của bước này
Để backend query dữ liệu đúng cấu trúc.

### Xong bước này khi nào
- Bạn có thể test trong Tinker hoặc controller tạm rằng relation hoạt động đúng.

### Chưa được làm tiếp
- Chưa làm form frontend.

---

## Bước 5: Hoàn thiện auth và profile

### Bạn cần làm gì
- Làm các API:
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/logout`
  - `GET /api/v1/auth/me`
  - `PATCH /api/v1/profile`
- Tạo request validation cho auth và profile.
- Test auth flow.

### Mục đích của bước này
Vì mọi dữ liệu goal đều phải gắn với user thật.

### Xong bước này khi nào
- User đăng ký được.
- User đăng nhập được.
- User logout được.
- Frontend refresh lại vẫn biết user đang đăng nhập hay không.

### Chưa được làm tiếp
- Chưa làm goal API nếu auth chưa ổn.

---

## Bước 6: Làm Goal API

### Bạn cần làm gì
- Tạo:
  - `GoalPolicy`
  - `StoreGoalRequest`
  - `UpdateGoalRequest`
  - `GoalController`
  - `GoalResource`
- Tạo các API:
  - list goal
  - create goal
  - xem chi tiết goal
  - update goal
  - delete goal

### Goal phải có tối thiểu các field
- `title`
- `description`
- `goal_type`
- `priority`
- `status`
- `start_date`
- `target_date`
- `note`

### Mục đích của bước này
Đây là lõi đầu tiên của sản phẩm.

### Xong bước này khi nào
- Postman hoặc frontend gọi được CRUD goal.
- User A không xem/sửa được goal của User B.

### Chưa được làm tiếp
- Chưa làm milestone nếu goal CRUD còn lỗi.

---

## Bước 7: Làm Milestone API

### Bạn cần làm gì
- Tạo:
  - `MilestonePolicy`
  - `StoreMilestoneRequest`
  - `UpdateMilestoneRequest`
  - `MilestoneController`
  - `MilestoneResource`
- Tạo API:
  - tạo milestone theo goal
  - xem milestone
  - sửa milestone
  - xóa milestone

### Mục đích của bước này
Goal phải chia được thành các chặng rõ ràng.

### Xong bước này khi nào
- Một goal có thể chứa nhiều milestone.
- Lấy goal detail ra thấy danh sách milestone đúng.

### Chưa được làm tiếp
- Chưa làm task nếu milestone chưa chạy ổn.

---

## Bước 8: Làm Task API

### Bạn cần làm gì
- Tạo:
  - `TaskPolicy`
  - `StoreTaskRequest`
  - `UpdateTaskRequest`
  - `TaskController`
  - `TaskResource`
- Tạo API:
  - tạo task trong milestone
  - xem task
  - sửa task
  - xóa task
  - complete task

### Task phải có tối thiểu các field
- `title`
- `description`
- `status`
- `priority`
- `due_at`
- `estimated_minutes`
- `is_focus`

### Mục đích của bước này
Task là đơn vị hành động nhỏ nhất mà user thao tác hằng ngày.

### Xong bước này khi nào
- User tạo task được.
- User complete task được.
- Task hiện đúng trong milestone tương ứng.

### Chưa được làm tiếp
- Chưa làm dashboard.

---

## Bước 9: Làm logic tự tính progress

### Bạn cần làm gì
- Tạo `GoalProgressService`.
- Khi task đổi trạng thái:
  - cập nhật progress milestone
  - cập nhật progress goal
- Ghi log vào `goal_logs` nếu cần.

### Công thức đơn giản nên dùng
- milestone progress = số task completed / tổng task
- goal progress = trung bình tiến độ milestone

### Mục đích của bước này
Nếu chưa có progress thật thì sản phẩm chưa có giá trị chính.

### Xong bước này khi nào
- Complete 1 task thì milestone đổi phần trăm ngay.
- Milestone đổi thì goal cũng đổi theo.

### Chưa được làm tiếp
- Chưa làm báo cáo.

---

## Bước 10: Làm frontend cho auth + goal + milestone + task

### Bạn cần làm gì
- Trang auth:
  - login
  - register
- Trang nghiệp vụ:
  - goals list
  - goal create
  - goal detail
- Component:
  - goal form
  - milestone form
  - task form
  - goal card
  - milestone card
  - task item

### Mục đích của bước này
Để user dùng được luồng chính trên giao diện thật.

### Xong bước này khi nào
- Từ UI có thể:
  - login
  - tạo goal
  - tạo milestone
  - tạo task
  - complete task

### Chưa được làm tiếp
- Chưa làm UI phụ như dark mode, report, AI.

---

## Bước 11: Làm dashboard cơ bản

### Bạn cần làm gì
- Backend:
  - `GET /api/v1/dashboard/summary`
- Frontend:
  - dashboard page
  - summary cards
  - danh sách task sắp đến hạn
  - goal đang làm

### Dashboard MVP chỉ cần có
- số goal đang active
- số goal hoàn thành
- số task hôm nay
- số task quá hạn

### Mục đích của bước này
Cho user thấy bức tranh tổng quan sau khi đã có dữ liệu thật.

### Xong bước này khi nào
- Dashboard không dùng mock data.
- Dashboard lấy dữ liệu thật từ backend.

### Chưa được làm tiếp
- Chưa làm biểu đồ phức tạp nếu summary còn sai.

---

## Bước 12: Test lại toàn bộ MVP

### Bạn cần làm gì
- Test tay toàn bộ flow:
  - register
  - login
  - create goal
  - create milestone
  - create task
  - complete task
  - xem progress
  - xem dashboard
- Viết test backend tối thiểu cho:
  - auth
  - goal CRUD
  - milestone CRUD
  - task complete
  - progress service

### Mục đích của bước này
Để chắc rằng MVP thật sự chạy được, không phải chỉ “có màn hình”.

### Xong bước này khi nào
- Luồng chính chạy từ đầu đến cuối không lỗi.
- Dữ liệu cập nhật đúng.
- Không bị lỗi quyền truy cập user khác.

---

## Sau khi xong 12 bước này thì mới làm gì tiếp
- Habit
- Reminder
- Journal
- Reports
- Export
- Dark mode
- AI

## Nếu hôm nay chỉ bắt đầu làm ngay thì thứ tự công việc là gì
1. dọn repo
2. chỉnh migrations
3. tạo models + relation
4. hoàn thiện auth
5. làm goal CRUD
6. làm milestone CRUD
7. làm task CRUD
8. làm progress service
9. nối frontend vào flow thật
10. làm dashboard summary

## Câu hỏi tự kiểm tra trước khi sang bước khác
- Bước hiện tại đã chạy thật chưa?
- Đã có dữ liệu thật chưa?
- Đã test tay chưa?
- Có đang làm thứ “đẹp hơn” nhưng chưa phải thứ “đúng hơn” không?

Nếu câu trả lời còn là “chưa”, thì chưa sang bước tiếp theo.
