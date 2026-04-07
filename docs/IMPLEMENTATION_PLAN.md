# Kế hoạch triển khai chi tiết theo từng bước

## 1. Mục đích của tài liệu
Tài liệu này dùng để chuyển bản đặc tả sản phẩm thành một kế hoạch triển khai có thể làm tuần tự từng bước. Mục tiêu là giúp dự án được xây đúng logic, đúng thứ tự phụ thuộc kỹ thuật, tránh tình trạng làm linh tinh, đụng đâu sửa đó, hoặc làm UI trước rồi phải phá backend sau.

Tài liệu này không thay thế file đặc tả sản phẩm. Nó là file “playbook thi công” đi kèm với [PROJECT_SPEC.md](/Users/dangduytien/Quan-ly-muc-tieu-ca-nhan/docs/PROJECT_SPEC.md).

## 2. Nguyên tắc triển khai bắt buộc

### 2.1 Không nhảy bước
- Không làm dashboard hoàn chỉnh khi chưa có schema và API ổn định.
- Không làm báo cáo khi chưa có dữ liệu nghiệp vụ chuẩn.
- Không làm AI khi chưa hoàn thiện luồng thủ công cốt lõi.
- Không polish UI quá sớm khi flow chính còn chưa chạy end-to-end.

### 2.2 Luôn đi theo thứ tự phụ thuộc
Thứ tự kỹ thuật chuẩn:
1. chốt phạm vi
2. dọn codebase
3. thiết kế database
4. migration + model + relation
5. request validation + policy + service
6. controller + resource + route
7. test backend
8. frontend types + api client + hooks
9. page + component + form
10. test tích hợp
11. seed dữ liệu
12. deploy staging

### 2.3 Mỗi module phải hoàn thành end-to-end
Không nên làm kiểu:
- viết hết model trước rồi để controller trống
- làm hết UI mock trước rồi chưa có API thật
- tạo nhiều màn hình nhưng chưa chạy được 1 luồng nào trọn vẹn

Cách đúng là:
- hoàn thành từng module từ database đến UI và test
- ví dụ module Goal phải đi đủ:
  - migration
  - model
  - request
  - policy
  - service
  - controller
  - route
  - test backend
  - frontend api
  - frontend page/form
  - integration check

### 2.4 Ưu tiên luồng giá trị cao nhất trước
Luồng giá trị cốt lõi của sản phẩm là:
1. đăng ký/đăng nhập
2. tạo goal
3. tạo milestone
4. tạo task
5. cập nhật task
6. tự tính progress
7. xem dashboard cơ bản

Nếu luồng này chưa chạy ổn, không nên mở rộng tính năng khác.

## 3. Bức tranh triển khai tổng thể

### 3.1 Thứ tự giai đoạn nên làm
1. Giai đoạn 0: Chốt scope và dọn repo
2. Giai đoạn 1: Dựng nền kỹ thuật và môi trường
3. Giai đoạn 2: Thiết kế lại schema và domain backend
4. Giai đoạn 3: Hoàn thiện auth và profile
5. Giai đoạn 4: Hoàn thiện Goal, Milestone, Task end-to-end
6. Giai đoạn 5: Dựng App Shell và các trang nền frontend
7. Giai đoạn 6: Dashboard, filter, search, calendar cơ bản
8. Giai đoạn 7: Habit, reminder, journal
9. Giai đoạn 8: Reports và performance score
10. Giai đoạn 9: Hardening, testing, staging deploy
11. Giai đoạn 10: Tính năng nâng cao
12. Giai đoạn 11: AI và tự động hóa

### 3.2 Luồng phụ thuộc giữa các giai đoạn
- Giai đoạn 0 là tiền đề cho tất cả các giai đoạn sau.
- Giai đoạn 2 phải xong trước khi làm backend nghiệp vụ thật.
- Giai đoạn 3 và 4 phải xong trước khi dashboard có dữ liệu thật.
- Giai đoạn 7 và 8 phụ thuộc vào dữ liệu từ goal/task/habit.
- Giai đoạn AI chỉ bắt đầu khi dữ liệu cốt lõi đã ổn định.

## 4. Giai đoạn 0: Chốt scope và dọn repo

### 4.1 Mục tiêu
Đưa codebase về trạng thái “đúng sản phẩm đang làm”, loại bỏ hoặc cô lập các phần thử nghiệm không còn phù hợp.

### 4.2 Việc phải làm
- Đọc lại file đặc tả và chốt rằng sản phẩm hiện tại là “quản lý mục tiêu cá nhân”.
- Rà soát backend hiện có:
  - `projects`
  - `subtasks`
  - `product controller/api`
  - `follow`
  - các model social hoặc thử nghiệm
- Rà soát frontend hiện có:
  - route cũ không dùng
  - component demo/mock
  - api file không thuộc sản phẩm
- Quyết định:
  - giữ lại phần nào
  - đánh dấu deprecated phần nào
  - chưa xóa ngay nếu còn đang tham chiếu, nhưng phải tách khỏi flow chính

### 4.3 Checklist hoàn thành
- Có danh sách rõ:
  - module giữ lại
  - module bỏ qua
  - module cần refactor
- Route auth hiện tại vẫn chạy được.
- Repo không còn lẫn lộn định hướng “project management”, “product API”, “social follow”.

### 4.4 Output của giai đoạn này
- Một codebase sạch hơn để bắt đầu xây đúng domain.
- File note nội bộ nếu cần, mô tả module nào sẽ không dùng nữa.

## 5. Giai đoạn 1: Dựng nền kỹ thuật và môi trường

### 5.1 Mục tiêu
Chuẩn bị môi trường phát triển ổn định trước khi code nghiệp vụ.

### 5.2 Việc phải làm ở backend
- Cấu hình `.env` cho local:
  - app url
  - database
  - queue
  - mail
- Chốt dùng `mysql` cho local dev thay vì sqlite nếu mục tiêu production cũng là MySQL.
- Kiểm tra Sanctum đang hoạt động đúng.
- Tạo base API version `/api/v1`.
- Tạo cấu trúc thư mục chuẩn:
  - `Controllers/Api/V1`
  - `Requests`
  - `Resources`
  - `Policies`
  - `Services`
  - `Enums`

### 5.3 Việc phải làm ở frontend
- Chốt giữ `react-scripts` tạm thời hay chuyển ngay sang `Vite`.
- Nếu chưa chuyển Vite ngay:
  - vẫn phải refactor cấu trúc thư mục theo feature-based
- Cài thư viện nền:
  - react-router
  - axios
  - tanstack query
  - zustand
  - react-hook-form
  - zod
  - chart library
- Tạo cấu trúc thư mục:
  - `app`
  - `features`
  - `components/ui`
  - `components/layout`
  - `lib/api`

### 5.4 Checklist hoàn thành
- Backend boot ổn định.
- Frontend boot ổn định.
- Có base route `/api/v1`.
- Có Axios client dùng chung.
- Có layout folder và feature folder chuẩn.

### 5.5 Output của giai đoạn này
- Nền kỹ thuật sẵn sàng để code nghiệp vụ.

## 6. Giai đoạn 2: Thiết kế lại schema và domain backend

### 6.1 Mục tiêu
Xây schema đúng domain “mục tiêu cá nhân”, không kéo theo di sản từ mô hình cũ.

### 6.2 Bước triển khai theo thứ tự
1. Chốt enum và tên field dùng thống nhất.
2. Viết migration cho bảng cốt lõi.
3. Chạy migrate trên local.
4. Tạo model và relationship.
5. Seed dữ liệu mẫu tối thiểu.
6. Viết test migration và basic relationship nếu cần.

### 6.3 Thứ tự bảng cần làm
1. `users`
2. `categories`
3. `tags`
4. `goals`
5. `milestones`
6. `tasks`
7. `habits`
8. `habit_logs`
9. `goal_logs`
10. `journal_entries`
11. `reminders`
12. `notifications`
13. `attachments`
14. `goal_templates`
15. pivot tables

### 6.4 Việc phải làm chi tiết
- Tạo enum trong backend:
  - `GoalTypeEnum`
  - `PriorityEnum`
  - `GoalStatusEnum`
  - `TaskStatusEnum`
  - `HabitFrequencyEnum`
  - `ReminderChannelEnum`
- Tạo migrations mới theo đặc tả.
- Kiểm tra toàn bộ index quan trọng.
- Thêm `softDeletes()` cho bảng phù hợp.
- Tạo các model:
  - `Goal`
  - `Milestone`
  - `Task`
  - `Habit`
  - `HabitLog`
  - `Category`
  - `Tag`
  - `GoalLog`
  - `Reminder`
  - `JournalEntry`
  - `Attachment`
  - `GoalTemplate`
- Cập nhật relationship trong `User`.

### 6.5 Những điểm phải khóa ngay từ đầu
- Tên trạng thái phải thống nhất giữa DB, backend, frontend.
- Cách tính progress phải chốt ngay từ giai đoạn này.
- `goal_id` trong task nên được giữ để query nhanh, dù task đã thuộc milestone.
- `user_id` phải có ở hầu hết bảng nghiệp vụ để policy đơn giản và an toàn hơn.

### 6.6 Checklist hoàn thành
- Migrate chạy sạch.
- Seeder tạo được dữ liệu mẫu.
- Model relation hoạt động đúng.
- Không còn phụ thuộc bắt buộc vào schema `project/task` cũ.

### 6.7 Output của giai đoạn này
- Domain data chuẩn để phát triển backend API thật.

## 7. Giai đoạn 3: Auth và profile

### 7.1 Mục tiêu
Hoàn thiện lớp xác thực và hồ sơ cá nhân để toàn bộ flow còn lại chạy trên user thật.

### 7.2 Backend cần làm
- Refactor auth route sang `/api/v1/auth/*`.
- Tách auth controller theo chuẩn API.
- Hoàn thiện các endpoint:
  - register
  - login
  - logout
  - auth/me
  - forgot password
  - reset password
  - update profile
  - change password
- Viết Form Request cho:
  - register
  - login
  - update profile
  - change password
- Viết feature test cho toàn bộ auth flow.

### 7.3 Frontend cần làm
- Tạo auth feature:
  - types
  - api
  - hooks
  - pages
  - schemas
- Tạo các trang:
  - login
  - register
  - forgot password
  - reset password
- Tạo auth provider hoặc auth store.
- Tạo protected route.
- Xử lý lưu token và logout.

### 7.4 Checklist hoàn thành
- User đăng ký được.
- User đăng nhập được.
- User logout được.
- Refresh trang vẫn nhận ra trạng thái đăng nhập.
- User sửa profile được.
- Test auth pass.

### 7.5 Output của giai đoạn này
- Hệ thống có lớp user thật để làm tiếp module nghiệp vụ.

## 8. Giai đoạn 4: Goal, Milestone, Task end-to-end

### 8.1 Mục tiêu
Xây luồng cốt lõi nhất của sản phẩm từ goal đến task, có progress thật.

### 8.2 Thứ tự triển khai bắt buộc
1. Goal
2. Milestone
3. Task
4. Progress recalculation
5. Goal log
6. Filter/search

### 8.3 Backend phần Goal
- Tạo:
  - `GoalPolicy`
  - `StoreGoalRequest`
  - `UpdateGoalRequest`
  - `GoalResource`
  - `GoalDetailResource`
  - `GoalController`
- Endpoint:
  - list
  - create
  - detail
  - update
  - delete
  - archive
  - duplicate
- Hỗ trợ:
  - filter theo status
  - filter theo priority
  - filter theo goal_type
  - search title/description
  - paginate

### 8.4 Backend phần Milestone
- Tạo:
  - `MilestonePolicy`
  - `StoreMilestoneRequest`
  - `UpdateMilestoneRequest`
  - `MilestoneResource`
  - `MilestoneController`
- Endpoint:
  - create theo goal
  - detail
  - update
  - delete
  - reorder
  - complete

### 8.5 Backend phần Task
- Tạo:
  - `TaskPolicy`
  - `StoreTaskRequest`
  - `UpdateTaskRequest`
  - `TaskResource`
  - `TaskController`
- Endpoint:
  - list
  - create theo milestone
  - detail
  - update
  - delete
  - complete
  - reorder
  - bulk status
  - toggle focus

### 8.6 Service bắt buộc phải có
- `GoalProgressService`
- Logic nên gồm:
  - recalc milestone progress khi task đổi trạng thái
  - recalc goal progress khi milestone đổi tiến độ
  - auto-complete milestone khi đủ điều kiện
  - gợi ý auto-complete goal nếu đủ điều kiện

### 8.7 Goal logs
- Mỗi thay đổi quan trọng cần ghi log:
  - tạo goal
  - đổi deadline
  - đổi status
  - tạo milestone
  - tạo task
  - task completed
  - goal completed

### 8.8 Frontend phần Goal/Milestone/Task
- Tạo feature modules:
  - `goals`
  - `milestones`
  - `tasks`
- Tạo pages:
  - goals list
  - goal create/edit
  - goal detail
  - tasks page
- Tạo component:
  - goal card
  - goal form
  - goal filter bar
  - milestone board
  - milestone card
  - task list
  - task item
  - task drawer/form
- Tạo hooks:
  - `useGoals`
  - `useGoalDetail`
  - `useCreateGoal`
  - `useMilestones`
  - `useTasks`

### 8.9 Checklist hoàn thành
- User tạo goal được.
- User tạo milestone trong goal được.
- User tạo task trong milestone được.
- Khi complete task, progress milestone cập nhật đúng.
- Khi milestone thay đổi tiến độ, goal progress cập nhật đúng.
- Goal detail hiển thị đúng dữ liệu thật từ API.
- Search/filter hoạt động được.

### 8.10 Output của giai đoạn này
- Luồng cốt lõi nhất của sản phẩm chạy end-to-end.

## 9. Giai đoạn 5: Dựng App Shell và các trang nền frontend

### 9.1 Mục tiêu
Hoàn thiện khung ứng dụng để các module có chỗ hiển thị thống nhất và dễ mở rộng.

### 9.2 Việc phải làm
- Tạo `AppLayout`.
- Tạo `Sidebar`.
- Tạo `Topbar`.
- Tạo `SectionHeader`.
- Tạo bộ UI dùng chung:
  - button
  - input
  - textarea
  - select
  - badge
  - card
  - modal
  - drawer
  - tabs
  - empty state
  - progress bar
- Tạo route tree rõ ràng.
- Tạo loading state và error state thống nhất.

### 9.3 Checklist hoàn thành
- Có layout thống nhất cho toàn app.
- Goal pages không còn code layout lặp lại.
- Responsive desktop trước, mobile sau.
- Component UI có thể tái sử dụng cho các module tiếp theo.

### 9.4 Output của giai đoạn này
- Frontend có nền kiến trúc tốt để thêm tính năng mà không rối.

## 10. Giai đoạn 6: Dashboard, filter, search, calendar cơ bản

### 10.1 Mục tiêu
Biến dữ liệu goal/task thành góc nhìn tổng quan hữu ích cho user.

### 10.2 Dashboard cần làm trước
- Summary cards:
  - active goals
  - completed goals
  - tasks due today
  - overdue tasks
- Upcoming section:
  - tasks sắp đến hạn
  - milestone sắp đến hạn
  - reminders gần nhất
- Progress chart:
  - số task hoàn thành theo tuần
  - goal status breakdown

### 10.3 Backend cần làm
- `DashboardController`
- `DashboardSummaryResource`
- endpoint:
  - `/dashboard/summary`
  - `/dashboard/upcoming`
  - `/dashboard/progress-chart`
- Tối ưu query, không gọi quá nhiều query nhỏ từ frontend.

### 10.4 Frontend cần làm
- Dashboard page thật, không dùng mock data.
- Chart components.
- Summary cards.
- Upcoming widget.
- Empty state khi user chưa có dữ liệu.

### 10.5 Calendar cơ bản
- Chỉ cần làm sau khi task và reminder đã ổn định.
- Hiển thị:
  - goal target date
  - milestone target date
  - task due date
  - reminder
- Chưa cần full sync ngoài hệ thống ở giai đoạn này.

### 10.6 Checklist hoàn thành
- Dashboard lấy dữ liệu thật từ API.
- Không còn mock data cứng trong dashboard chính.
- User xem được việc hôm nay và các deadline gần tới.
- Calendar hiển thị được item cơ bản theo ngày/tuần/tháng.

## 11. Giai đoạn 7: Habit, reminder, journal

### 11.1 Mục tiêu
Tăng khả năng duy trì thói quen và review tiến độ hằng ngày.

### 11.2 Thứ tự nên làm
1. Habit
2. Habit log
3. Reminder
4. Notification center
5. Journal entry

### 11.3 Habit module backend
- tạo migration nếu chưa có hoặc refactor schema hiện có
- tạo:
  - `HabitPolicy`
  - `StoreHabitRequest`
  - `UpdateHabitRequest`
  - `HabitController`
  - `HabitLogController`
  - `HabitStreakService`
- endpoint:
  - list/create/detail/update/delete habit
  - log habit
  - list habit logs
  - habits today

### 11.4 Reminder module backend
- tạo:
  - `ReminderPolicy`
  - `StoreReminderRequest`
  - `UpdateReminderRequest`
  - `ReminderController`
  - `ReminderService`
  - `SendReminderJob`
- scheduler:
  - quét reminder pending
- notification:
  - lưu DB notification

### 11.5 Journal module backend
- tạo:
  - `JournalEntryPolicy`
  - `StoreJournalEntryRequest`
  - `UpdateJournalEntryRequest`
  - `JournalEntryController`
- endpoint CRUD đầy đủ

### 11.6 Frontend cần làm
- Habits page
- Habit cards
- Log habit nhanh theo ngày
- Journal page
- Reminder form
- Notification center

### 11.7 Checklist hoàn thành
- User tạo habit được.
- User log habit theo ngày được.
- Streak cập nhật đúng.
- Reminder được tạo và gửi đúng lịch.
- User viết journal được.
- Notification center đọc được dữ liệu thật.

## 12. Giai đoạn 8: Reports và performance score

### 12.1 Mục tiêu
Tạo lớp phân tích để user review tiến độ cá nhân theo chu kỳ.

### 12.2 Điều kiện tiên quyết
- Goal, task, habit, journal phải có dữ liệu thật.
- Dashboard summary phải chạy ổn.

### 12.3 Backend cần làm
- `ReportController`
- `PerformanceScoreService`
- `ReportAggregationService`
- endpoint:
  - weekly report
  - monthly report
  - quarterly report
  - performance score
  - chart datasets

### 12.4 Công thức performance score gợi ý
Có thể bắt đầu đơn giản:
- 40% từ tỷ lệ task hoàn thành đúng hạn
- 25% từ habit consistency
- 20% từ completion rate của goal/milestone
- 15% từ overdue ratio nghịch đảo

Không nên làm công thức quá phức tạp ở lần đầu.

### 12.5 Frontend cần làm
- Reports page
- Time range filter
- KPI grid
- Completion trend chart
- Habit consistency chart
- Category breakdown chart
- Performance score card và explanation

### 12.6 Checklist hoàn thành
- User xem báo cáo tuần/tháng/quý được.
- Biểu đồ lấy dữ liệu thật từ backend.
- Performance score hiển thị được và có giải thích.

## 13. Giai đoạn 9: Hardening, testing, staging deploy

### 13.1 Mục tiêu
Làm cho hệ thống đủ ổn định để đưa lên staging và demo thực tế.

### 13.2 Testing bắt buộc
- Backend feature tests:
  - auth
  - goal CRUD
  - milestone/task flow
  - habit logging
  - dashboard summary
- Backend unit tests:
  - goal progress service
  - habit streak service
  - performance score service
- Frontend tests:
  - auth form
  - goal form
  - dashboard render
- E2E nếu có thời gian:
  - register -> goal -> milestone -> task -> complete task

### 13.3 Hardening bắt buộc
- Rate limit auth endpoints.
- Policy kiểm tra ownership đầy đủ.
- Validation đủ chặt cho input.
- Xử lý lỗi JSON chuẩn.
- Không để mock data tồn tại ở màn hình chính.
- Kiểm tra timezone và date formatting.

### 13.4 Staging deploy
- Chuẩn bị:
  - env staging
  - database staging
  - queue worker staging
  - scheduler staging
- CI/CD tối thiểu:
  - frontend build
  - backend test
  - deploy staging

### 13.5 Checklist hoàn thành
- Toàn bộ flow MVP chạy trên staging.
- Không có lỗi auth cơ bản.
- Không có route bị hở dữ liệu user khác.
- Test quan trọng pass.

## 14. Giai đoạn 10: Tính năng nâng cao

### 14.1 Mục tiêu
Thêm các tính năng giúp sản phẩm đủ chiều sâu cho người dùng lâu dài.

### 14.2 Thứ tự nên làm
1. Goal templates
2. Export PDF/Excel
3. Backup/restore
4. Dark mode
5. Đa ngôn ngữ
6. Google Calendar sync

### 14.3 Lý do thứ tự này hợp lý
- Template dựa trên domain hiện có, dễ làm trước.
- Export cần dữ liệu đã ổn định.
- Backup/restore cần schema chốt tương đối.
- Dark mode và i18n là lớp presentation.
- Google Calendar sync có tích hợp ngoài nên làm sau.

## 15. Giai đoạn 11: AI và tự động hóa

### 15.1 Mục tiêu
Thêm lớp thông minh sau khi hệ thống thủ công đã thật sự ổn định.

### 15.2 Thứ tự nên làm
1. AI goal breakdown
2. AI goal estimate
3. AI risk analysis
4. AI habit suggestion
5. AI weekly review summary

### 15.3 Điều kiện bắt buộc trước khi làm AI
- API core ổn định.
- Dữ liệu goal/milestone/task/habit đủ sạch.
- Có queue để xử lý tác vụ async.
- Có logging để theo dõi chất lượng gợi ý.

## 16. Cách làm việc theo từng module để không bị rối

### 16.1 Công thức triển khai chuẩn cho một module
Ví dụ với module `Goal`:
1. tạo migration hoặc xác nhận schema
2. tạo model + relation
3. tạo enum nếu cần
4. tạo request validation
5. tạo policy
6. tạo service cho business logic
7. tạo resource cho response
8. tạo controller
9. khai báo route
10. viết feature test
11. viết frontend types
12. viết frontend api service
13. viết frontend hooks
14. viết form và page
15. tích hợp thật với backend
16. kiểm tra lại end-to-end

### 16.2 Không nên làm module theo kiểu nào
- Không tạo page trước khi biết response API shape.
- Không tạo API trước khi chưa chốt validation.
- Không làm query report trước khi schema tracking còn mơ hồ.
- Không viết UI đẹp quá sớm khi flow nghiệp vụ còn đổi liên tục.

## 17. Danh sách việc nên làm ngay trong 7 ngày đầu

### Ngày 1
- đọc lại đặc tả
- dọn repo
- chốt module giữ/bỏ
- chốt naming convention

### Ngày 2
- tạo/refactor migrations cốt lõi
- migrate local
- tạo models và relations

### Ngày 3
- auth v1
- profile endpoints
- auth tests

### Ngày 4
- goals CRUD backend
- goals frontend list/create/edit cơ bản

### Ngày 5
- milestones CRUD backend/frontend
- tasks CRUD backend/frontend

### Ngày 6
- progress recalculation
- goal logs
- goal detail page

### Ngày 7
- dashboard summary
- sửa bug flow cốt lõi
- seed data
- smoke test end-to-end

## 18. Danh sách việc không được làm quá sớm
- Không làm AI ngay.
- Không làm Google Calendar sync ngay.
- Không làm gamification ngay.
- Không làm export trước khi report cơ bản chạy đúng.
- Không làm mobile app trước khi web MVP ổn định.
- Không optimize performance sớm khi chưa có bottleneck thật.

## 19. Definition of Done theo cấp dự án

### 19.1 Done cho từng task kỹ thuật
- code chạy được
- có validation
- có xử lý lỗi cơ bản
- có test tối thiểu nếu là backend nghiệp vụ
- không phá flow cũ

### 19.2 Done cho từng module
- có API thật
- có UI thật
- có dữ liệu thật
- có test chính
- có thể demo được

### 19.3 Done cho MVP
- user auth hoàn chỉnh
- goal/milestone/task hoàn chỉnh
- progress auto update
- dashboard cơ bản
- filter/search cơ bản
- calendar cơ bản
- staging deploy được

## 20. Khuyến nghị thực tế để bạn làm không bị ngợp
- Mỗi lần chỉ tập trung 1 giai đoạn.
- Mỗi giai đoạn chỉ nên chốt 1 luồng chạy được trước khi mở rộng.
- Nếu bị rối, quay lại luồng cốt lõi:
  - login
  - create goal
  - create milestone
  - create task
  - complete task
  - see progress
- Hãy coi các tính năng như habit, report, AI là “lớp sau”, không phải nền móng.

## 21. Bước tiếp theo ngay sau tài liệu này
Ngay sau khi có file này, bước hợp lý nhất là bắt đầu thực thi theo đúng thứ tự:
1. dọn repo và khóa scope
2. dựng lại schema chuẩn
3. refactor auth sang `/api/v1`
4. build goal/milestone/task end-to-end
5. sau đó mới sang dashboard

Nếu bám đúng tài liệu này, bạn sẽ luôn biết hiện tại đang ở bước nào, vì sao phải làm bước đó, và bước tiếp theo là gì.
