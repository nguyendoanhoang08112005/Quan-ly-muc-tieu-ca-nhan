# Đặc tả sản phẩm: Ứng dụng web quản lý mục tiêu cá nhân

## 1. Tổng quan sản phẩm

### 1.1 Tầm nhìn sản phẩm
Xây dựng một ứng dụng web fullstack giúp người dùng thiết lập mục tiêu cá nhân, chia mục tiêu thành lộ trình thực thi, theo dõi tiến độ, duy trì thói quen và đánh giá kết quả theo thời gian, với trải nghiệm hiện đại, tối giản, ưu tiên desktop trước nhưng vẫn responsive tốt trên mobile.

### 1.2 Mục tiêu của hệ thống
- Biến những mục tiêu mơ hồ thành kế hoạch có cấu trúc, có thể đo lường và có hạn hoàn thành rõ ràng.
- Giúp người dùng duy trì tính nhất quán bằng deadline, nhắc việc, habit tracker, nhật ký tiến độ và báo cáo định kỳ.
- Cung cấp góc nhìn tổng thể về tiến độ, rủi ro trễ hạn và hiệu suất cá nhân.
- Tạo nền tảng đủ tốt để phát triển dần từ một MVP quản lý mục tiêu sang một hệ thống “personal operating system” có AI hỗ trợ.

### 1.3 Nhóm người dùng mục tiêu
- Sinh viên muốn quản lý kế hoạch học tập, ngoại ngữ, chứng chỉ, kỹ năng cá nhân.
- Nhân viên văn phòng quản lý mục tiêu nghề nghiệp, sức khỏe, tài chính, side-project.
- Freelancer hoặc solopreneur cần theo dõi mục tiêu dài hạn song song với công việc hằng ngày.
- Người theo đuổi self-improvement, cần streak, focus mode, habit tracker và báo cáo cá nhân.
- Power user thích phân rã kế hoạch, đo lường tiến độ và xem phân tích hiệu suất theo tuần/tháng/quý.

### 1.4 Các bài toán hệ thống giải quyết
- Người dùng đặt mục tiêu quá chung chung và không biết bắt đầu từ đâu.
- Mục tiêu không được chia thành milestone, task hằng ngày và thói quen hỗ trợ.
- Tiến độ khó đo lường, đặc biệt với mục tiêu trung hạn và dài hạn.
- Người dùng mất động lực vì không thấy rõ mức độ hoàn thành, streak hay rủi ro trễ hạn.
- Sau mỗi chu kỳ làm việc, người dùng không có dữ liệu để review và cải thiện cách lập kế hoạch.

### 1.5 Giá trị cốt lõi của sản phẩm
- Rõ ràng: biến mục tiêu thành các bước cụ thể, có deadline, có logic thực thi.
- Kỷ luật: duy trì nhịp làm việc qua habit, reminder, focus mode và log tiến độ.
- Minh bạch: dashboard, lịch, báo cáo và biểu đồ giúp nhìn thấy cái gì đang tiến triển và cái gì đang bị kẹt.
- Tự phản hồi: nhật ký, lịch sử chỉnh sửa và performance score giúp người dùng review bản thân.
- Mở rộng tốt: kiến trúc đủ linh hoạt để thêm AI, gamification, export, sync lịch và automation.

### 1.6 Phạm vi sản phẩm và giả định ban đầu
- Giai đoạn đầu là hệ thống một người dùng một workspace cá nhân, chưa ưu tiên collaboration.
- Toàn bộ dữ liệu cốt lõi đều là dữ liệu riêng tư theo `user_id`.
- API được version hóa ngay từ đầu theo chuẩn `/api/v1`.
- Frontend và backend tách biệt, giao tiếp qua RESTful API.
- Đính kèm file là tính năng nên có từ Phase 2, không bắt buộc trong MVP đầu tiên.

### 1.7 Kiến trúc công nghệ đề xuất

#### Frontend stack đề xuất
- `React 18 + TypeScript + TSX`
- `Vite` để build/dev nhanh hơn. Repo hiện tại đang dùng `react-scripts`, nên khuyến nghị chuyển sang Vite trước khi mở rộng nhiều tính năng.
- `React Router` để quản lý route, nested layout, protected route.
- `Tailwind CSS` để triển khai UI hiện đại, tối giản, responsive nhanh.
- `Radix UI` hoặc `Headless UI` cho các primitive component dễ kiểm soát giao diện.
- `React Hook Form + Zod` cho form handling và validation phía frontend.
- `TanStack Query` cho server state: cache, fetch, invalidation, optimistic update.
- `Zustand` cho UI state nhẹ: sidebar collapse, filter, theme, focus mode, calendar mode.
- `Axios` làm API client.
- `Recharts` hoặc `Apache ECharts` để hiển thị dashboard và biểu đồ.
- `dayjs` để xử lý ngày giờ, timezone, format.
- `dnd-kit` cho kéo thả task/milestone.

#### Backend stack đề xuất
- `Laravel 12 + PHP 8.2`
- `Laravel Sanctum` làm auth mặc định
- `MySQL 8.0+`
- `Laravel Queue` cho reminder, notification, export, AI jobs
- `Laravel Scheduler` cho các tác vụ lặp: overdue scan, nhắc việc, weekly report
- `Form Request` cho validation
- `API Resource` cho chuẩn hóa response
- `Policy` cho phân quyền theo ownership
- Các package nên dùng thêm:
  - `spatie/laravel-query-builder`
  - `spatie/laravel-activitylog`
  - `maatwebsite/excel`
  - `barryvdh/laravel-dompdf`
  - `laravel/horizon` khi queue tăng tải

#### Auth strategy: chọn Sanctum hay JWT
- Khuyến nghị dùng `Laravel Sanctum` vì:
  - Repo hiện tại đã cài Sanctum sẵn.
  - Dễ tích hợp với Laravel hơn JWT.
  - Dễ revoke token, quản lý session/token theo thiết bị.
  - Phù hợp cả hướng SPA lẫn mobile/API token về sau.
- Cách đi thực tế:
  - MVP: dùng bearer token qua Sanctum để frontend tích hợp nhanh.
  - Production hardening: nếu frontend/backend cùng domain tin cậy, có thể chuyển sang cookie + HttpOnly + CSRF flow.
- JWT chỉ nên cân nhắc khi sau này hệ thống cần một auth model thiên về external clients hoặc multi-platform phức tạp.

### 1.8 Cách tổ chức frontend và backend

#### Frontend
```text
frontend/
  src/
    app/
      router/
      providers/
      store/
    assets/
    components/
      ui/
      layout/
      forms/
      charts/
      feedback/
    features/
      auth/
      dashboard/
      goals/
      milestones/
      tasks/
      habits/
      reminders/
      notifications/
      journal/
      reports/
      settings/
      templates/
    hooks/
    lib/
      api/
      utils/
      constants/
      date/
    types/
    styles/
    main.tsx
```

#### Backend
```text
backend/
  app/
    Http/
      Controllers/Api/V1/
      Requests/
      Resources/
      Middleware/
    Models/
    Policies/
    Services/
    Actions/
    Jobs/
    Notifications/
    Events/
    Listeners/
    Enums/
    Support/
  bootstrap/
  config/
  database/
    migrations/
    seeders/
    factories/
  routes/
    api.php
  tests/
    Feature/
    Unit/
```

### 1.9 Cách giao tiếp API giữa React TSX và Laravel
- Frontend gọi API qua `Axios client` với `baseURL = /api/v1`.
- Định dạng JSON thống nhất:
  - success: `success`, `message`, `data`, `meta`
  - error: `success`, `message`, `errors`, `code`
- MVP dùng `Authorization: Bearer <token>`.
- Các endpoint list cần hỗ trợ:
  - `page`, `per_page`
  - `search`
  - `sort`
  - `filter[status]`
  - `filter[priority]`
  - `filter[target_date_from]`
  - `filter[target_date_to]`
  - `include=milestones,tags`

### 1.10 Gợi ý package/thư viện nên dùng

#### Frontend
- `@tanstack/react-query`
- `react-hook-form`
- `zod`
- `@hookform/resolvers`
- `zustand`
- `axios`
- `dayjs`
- `clsx`
- `tailwind-merge`
- `recharts`
- `sonner` hoặc `react-hot-toast`
- `fullcalendar` hoặc `react-calendar`

#### Backend
- `laravel/sanctum`
- `spatie/laravel-query-builder`
- `spatie/laravel-activitylog`
- `maatwebsite/excel`
- `barryvdh/laravel-dompdf`
- `laravel/horizon`

### 1.11 Hiện trạng repo hiện tại và định hướng refactor
- Frontend hiện đang dùng `react-scripts` và cấu trúc thiên về route-based.
- Backend hiện đang có sẵn auth cơ bản với Sanctum, cùng các model thử nghiệm như `Goal`, `Task`, `Habit`.
- Schema hiện tại còn một số phần chưa đồng nhất với domain “quản lý mục tiêu cá nhân”, ví dụ `project_id`, `subtasks`, một số model social/product không liên quan.
- Hướng triển khai thực tế:
  - Giữ lại nền auth hiện tại.
  - Tạo API version `v1`.
  - Chuẩn hóa domain chính thành `goals -> milestones -> tasks`.
  - Giảm hoặc loại bỏ các module thử nghiệm không nằm trong sản phẩm mục tiêu.

## 2. Phân rã chức năng

### 2.1 Phân tầng chức năng tổng thể
- `Base cơ bản`: đủ để tạo mục tiêu, chia milestone/task, theo dõi tiến độ.
- `Trung cấp`: tăng khả năng duy trì kỷ luật, nhắc việc, habit tracker, báo cáo.
- `Nâng cao`: AI, template, export, backup, gamification, đa ngôn ngữ, sync.
- `Mở rộng tương lai`: collaboration, community, mobile app, coaching, automation sâu.

### 2.2 Base cơ bản
- Đăng ký, đăng nhập, quên mật khẩu, đặt lại mật khẩu, cập nhật hồ sơ.
- Dashboard cá nhân.
- CRUD mục tiêu cá nhân.
- Phân loại mục tiêu: ngắn hạn, trung hạn, dài hạn.
- Chia mục tiêu thành milestone.
- Chia milestone thành task nhỏ.
- Deadline cho goal, milestone, task.
- Trạng thái: chưa bắt đầu, đang làm, hoàn thành, tạm dừng.
- Theo dõi phần trăm tiến độ.
- Ghi chú cho từng mục tiêu.
- Bộ lọc và tìm kiếm.
- Giao diện lịch trình cơ bản theo ngày/tuần/tháng.

### 2.3 Trung cấp
- Habit tracker theo ngày.
- Reminder và notification center.
- Mục tiêu hoặc task lặp lại theo chu kỳ.
- Priority level cho goal/task.
- Tag và category.
- Nhật ký tiến độ hằng ngày.
- Thống kê theo tuần/tháng/quý.
- Biểu đồ tiến độ.
- Performance score cá nhân.
- Focus mode cho việc quan trọng.
- Checklist theo milestone.
- Lịch sử chỉnh sửa mục tiêu.

### 2.4 Nâng cao
- AI gợi ý chia nhỏ mục tiêu thành lộ trình.
- AI ước lượng thời gian hoàn thành.
- AI cảnh báo nguy cơ trễ deadline.
- Goal templates.
- Smart habit recommendation.
- Gamification: điểm, streak, level, badge.
- Export PDF/Excel.
- Backup/restore.
- Dark mode.
- Đa ngôn ngữ.
- Đồng bộ Google Calendar.
- Thống kê chuyên sâu và đánh giá hiệu suất cá nhân.

### 2.5 Mở rộng tương lai
- Team/family/shared goals.
- Accountability partner.
- Coach dashboard hoặc mentor mode.
- Mobile app riêng.
- Voice note và speech-to-plan.
- Smart nudges dựa trên burnout/risk signal.
- Tích hợp Notion, Slack, Telegram, Apple Calendar.
- Public goal challenge, template marketplace, cộng đồng.

### 2.6 Danh sách chức năng Base cơ bản chi tiết

#### Xác thực và hồ sơ cá nhân
- Đăng ký với `name`, `email`, `password`, `password_confirmation`.
- Đăng nhập bằng email/password.
- Quên mật khẩu qua email.
- Đặt lại mật khẩu bằng token bảo mật.
- Đăng xuất phiên hiện tại.
- Cập nhật hồ sơ: avatar, tên hiển thị, timezone, ngôn ngữ, chế độ giao diện.
- Đổi mật khẩu khi đã đăng nhập.

#### Dashboard cá nhân
- Khối KPI trên cùng:
  - tổng số mục tiêu đang active
  - số mục tiêu hoàn thành
  - số task đến hạn hôm nay
  - số task quá hạn
  - tỷ lệ habit hoàn thành hôm nay
  - điểm hiệu suất cá nhân
- Widget chính:
  - agenda hôm nay
  - tiến độ mục tiêu
  - milestone có rủi ro trễ hạn
  - nhắc việc sắp tới
  - streak habit
  - nhật ký gần đây

#### Goal management
- Tạo mục tiêu với:
  - tiêu đề
  - mô tả
  - loại mục tiêu
  - trạng thái
  - mức ưu tiên
  - category
  - tags
  - ngày bắt đầu
  - deadline
  - success metric
  - ghi chú chiến lược
- Sửa mục tiêu.
- Xem chi tiết mục tiêu.
- Lưu trữ mềm hoặc xóa mềm.
- Nhân bản mục tiêu.

#### Milestone management
- Tạo nhiều milestone trong một goal.
- Mỗi milestone có:
  - tiêu đề
  - mô tả
  - thứ tự
  - trạng thái
  - deadline
  - ghi chú
  - checklist cơ bản
- Có thể sắp xếp lại thứ tự milestone.

#### Task management
- Tạo task trong milestone.
- Task có các trường:
  - tiêu đề
  - mô tả
  - trạng thái
  - độ ưu tiên
  - due date
  - estimated minutes
  - actual minutes
  - cờ focus
- Hỗ trợ hoàn thành nhanh.
- Hỗ trợ reorder bằng kéo thả.
- MVP có thể để task phẳng theo milestone, chưa cần subtask sâu.

#### Theo dõi tiến độ
- Tiến độ milestone được tính theo số task hoàn thành trên tổng task.
- Tiến độ goal được tính theo milestone hoặc tổng task liên quan.
- Khuyến nghị triển khai:
  - `milestone progress = completed tasks / total tasks`
  - `goal progress = trung bình có trọng số của milestone`
- Không nên cho người dùng nhập tay `% progress` tự do ở MVP.
- Nếu cần ghi nhận cảm nhận tiến độ, dùng `goal_logs` hoặc `journal_entries`.

#### Ghi chú, tìm kiếm, lọc, lịch
- Mỗi goal có tab ghi chú riêng.
- Tìm kiếm theo goal title, milestone title, task title, tag.
- Lọc theo trạng thái, loại, ưu tiên, khoảng thời gian, category, overdue.
- Lịch cơ bản hiển thị deadline và reminder theo ngày/tuần/tháng.

### 2.7 Chức năng Trung cấp chi tiết

#### Habit tracker
- Tạo habit daily/weekly/monthly.
- Thiết lập `target_count`.
- Log mức hoàn thành từng ngày.
- Tự tính `current_streak`, `best_streak`.
- Liên kết habit với goal để nhìn thấy habit nào đang hỗ trợ mục tiêu nào.

#### Reminder và thông báo
- Tạo nhắc việc theo thời điểm cố định hoặc trước deadline.
- Các loại cảnh báo:
  - due today
  - overdue
  - milestone sắp trễ
  - habit có nguy cơ gãy streak
- Notification center hiển thị chưa đọc/đã đọc.

#### Mục tiêu hoặc task lặp lại
- Ví dụ:
  - “Review tuần”
  - “Đọc sách 30 phút mỗi ngày”
  - “Viết journal tối”
- Có thể lưu recurrence rule ở dạng JSON.

#### Nhật ký tiến độ
- Ghi nhận theo ngày:
  - đã làm gì
  - gặp khó khăn gì
  - chiến thắng nhỏ
  - bước tiếp theo
  - mood/energy/productivity score

#### Báo cáo và thống kê
- Thống kê completion rate theo tuần/tháng/quý.
- Tỷ lệ task quá hạn.
- Habit consistency.
- Thời gian thực tế so với ước lượng.
- Mục tiêu hoàn thành theo category.

#### Focus mode
- Chọn 1 task hoặc 1 goal trọng tâm.
- Ẩn bớt thành phần gây phân tán.
- Có thể mở rộng sau này thành timer/pomodoro.

#### Checklist milestone và edit history
- Checklist là tập item nhỏ trong milestone.
- Edit history ghi nhận:
  - thay đổi tiêu đề
  - thay đổi deadline
  - đổi trạng thái
  - đổi milestone/task structure

### 2.8 Chức năng Nâng cao chi tiết

#### AI gợi ý lộ trình
- Nhập mục tiêu + deadline + bối cảnh cá nhân.
- AI trả về:
  - milestone đề xuất
  - task đề xuất
  - habit phù hợp
  - nhịp thực hiện gợi ý
  - cảnh báo nếu kế hoạch quá tải

#### AI dự đoán thời gian hoàn thành
- Ước tính dựa trên:
  - loại mục tiêu
  - số lượng task
  - capacity theo tuần
  - lịch sử hiệu suất cũ

#### AI cảnh báo nguy cơ trễ hạn
- So sánh tiến độ hiện tại với số ngày còn lại.
- Phát hiện milestone bị kẹt quá lâu.
- Phát hiện habit quan trọng đang bị bỏ dở.

#### Goal templates
- Template hệ thống hoặc template cá nhân.
- Có thể chứa:
  - goal mặc định
  - milestone mẫu
  - task mẫu
  - duration days gợi ý

#### Smart habit recommendation
- Gợi ý habit theo loại goal:
  - học ngoại ngữ
  - thể thao
  - tài chính
  - viết blog
- Gợi ý khối lượng thói quen thực tế hơn theo lịch sử người dùng.

#### Gamification
- XP khi hoàn thành task.
- Điểm streak khi duy trì habit.
- Badge theo cột mốc.
- Level cá nhân theo consistency.

#### Export, backup, dark mode, i18n, calendar sync
- Export goal/report sang PDF.
- Export dữ liệu sang Excel/CSV.
- Sao lưu dữ liệu người dùng theo snapshot.
- Dark mode.
- Hỗ trợ `vi`, `en`.
- Sync Google Calendar cho task/reminder/deadline.

### 2.9 Luồng nghiệp vụ chính

#### Luồng 1: User đăng ký và onboarding
1. Người dùng truy cập landing page.
2. Chọn `Đăng ký`.
3. Nhập `name`, `email`, `password`, `password_confirmation`.
4. Hệ thống validate dữ liệu và tạo tài khoản.
5. Hệ thống sinh token đăng nhập.
6. User được chuyển đến onboarding.
7. Onboarding hỏi các thông tin tối thiểu:
   - timezone
   - mục tiêu ưu tiên
   - category quan tâm
   - tuần bắt đầu từ thứ mấy
8. Hệ thống lưu `onboarding_completed_at`.
9. User được điều hướng sang dashboard cá nhân.

#### Luồng 2: Tạo mục tiêu mới
1. User bấm `Tạo mục tiêu`.
2. Mở form tạo goal.
3. User nhập tiêu đề, mô tả, loại mục tiêu, deadline, priority, category, tags.
4. Frontend validate cơ bản.
5. Gửi request `POST /goals`.
6. Backend validate bằng `StoreGoalRequest`.
7. Tạo goal, gán `user_id`.
8. Trả về `GoalResource`.
9. Frontend redirect sang `Goal Detail`.

#### Luồng 3: Chia mục tiêu thành milestone và task
1. Tại `Goal Detail`, user chọn tab `Milestones`.
2. Bấm `Thêm milestone`.
3. Nhập tiêu đề, mô tả, deadline, thứ tự.
4. Hệ thống tạo milestone thuộc goal.
5. Trong milestone, user thêm nhiều task nhỏ.
6. Mỗi task có trạng thái ban đầu là `not_started`.
7. Sau khi có task, hệ thống tự tính progress của milestone.
8. Goal progress cũng được cập nhật theo milestone.

#### Luồng 4: Cập nhật tiến độ
1. User đánh dấu task `in_progress` hoặc `completed`.
2. Backend cập nhật `started_at` hoặc `completed_at`.
3. Service tính lại progress của milestone.
4. Service tính lại progress của goal.
5. Hệ thống ghi log vào `goal_logs`.
6. Dashboard query mới sẽ phản ánh số liệu cập nhật.

#### Luồng 5: Hoàn thành mục tiêu
1. Toàn bộ milestone hoặc phần lớn task đã hoàn tất.
2. User bấm `Hoàn thành mục tiêu` hoặc hệ thống gợi ý auto-complete.
3. Backend kiểm tra điều kiện hoàn thành.
4. Nếu hợp lệ, cập nhật `status = completed`, `completed_at = now`.
5. Ghi log completion.
6. Có thể cộng điểm gamification ở phase nâng cao.

#### Luồng 6: Theo dõi thói quen mỗi ngày
1. User vào trang `Habits`.
2. Danh sách habit hôm nay được hiển thị.
3. User log số lần hoàn thành hoặc tick `done`.
4. Backend tạo/cập nhật `habit_logs` theo `habit_id + log_date`.
5. Service cập nhật streak.
6. Dashboard và report phản ánh lại habit completion.

#### Luồng 7: Nhận nhắc việc và cảnh báo trễ hạn
1. User tạo reminder hoặc hệ thống tự sinh reminder theo due date.
2. Scheduler quét các reminder `pending`.
3. Queue gửi notification đúng thời điểm.
4. Nếu task/milestone sắp trễ nhưng progress thấp, hệ thống tạo cảnh báo risk.
5. Notification xuất hiện trong notification center.

#### Luồng 8: Xem báo cáo hiệu suất
1. User vào `Reports`.
2. Chọn phạm vi thời gian tuần/tháng/quý hoặc custom range.
3. Frontend gọi API report tương ứng.
4. Backend tổng hợp:
   - completion rate
   - overdue ratio
   - habit consistency
   - performance score
   - chart datasets
5. Frontend render KPI và biểu đồ.
6. User có thể export report ở phase nâng cao.

## 3. Thiết kế cơ sở dữ liệu

### 3.1 Nguyên tắc thiết kế dữ liệu
- Hầu hết bảng nghiệp vụ phải có `user_id`, trừ bảng template hệ thống hoặc metadata dùng chung.
- Dùng `softDeletes()` cho dữ liệu người dùng để hỗ trợ khôi phục và audit.
- Dùng enum hoặc string có validate chặt cho `status`, `priority`, `frequency`, `goal_type`.
- Chỉ dùng JSON cho dữ liệu linh hoạt, không dùng JSON cho các trường nghiệp vụ cốt lõi nếu có thể tách bảng.
- Bổ sung `created_at`, `updated_at`, `deleted_at`, và các field theo ngữ cảnh như `completed_at`, `started_at`, `last_logged_at`.

### 3.2 Danh sách bảng tối thiểu cần có
- `users`
- `goals`
- `milestones`
- `tasks`
- `habits`
- `habit_logs`
- `categories`
- `tags`
- `goal_logs`
- `reminders`
- `notifications`
- `journal_entries`
- `attachments`
- `goal_templates`

### 3.3 Bảng hỗ trợ nên có thêm
- `goal_tag`
- `goal_category`
- `task_tag`
- `user_settings`
- `activity_logs`
- `template_milestones`
- `template_tasks`
- `exports`

### 3.4 Thiết kế chi tiết từng bảng

#### users
| Cột | Kiểu dữ liệu | Ghi chú |
|---|---|---|
| id | bigint unsigned | PK |
| name | varchar(150) | bắt buộc |
| email | varchar(190) | unique |
| email_verified_at | timestamp nullable | xác thực email |
| password | varchar(255) | mật khẩu đã hash |
| avatar_path | varchar(255) nullable | đường dẫn avatar |
| timezone | varchar(64) default 'Asia/Ho_Chi_Minh' | múi giờ |
| locale | varchar(10) default 'vi' | `vi`, `en` |
| theme | varchar(20) default 'light' | `light`, `dark`, `system` |
| week_starts_on | tinyint unsigned default 1 | 0 CN, 1 Thứ 2 |
| onboarding_completed_at | timestamp nullable | đã onboarding |
| last_active_at | timestamp nullable | theo dõi hoạt động |
| remember_token | varchar(100) nullable | mặc định Laravel |
| created_at | timestamp | audit |
| updated_at | timestamp | audit |
| deleted_at | timestamp nullable | soft delete nếu cần |

Index nên có:
- unique `email`
- index `onboarding_completed_at`
- index `last_active_at`

#### goals
| Cột | Kiểu dữ liệu | Ghi chú |
|---|---|---|
| id | bigint unsigned | PK |
| user_id | bigint unsigned | FK users |
| category_id | bigint unsigned nullable | category chính |
| title | varchar(180) | bắt buộc |
| slug | varchar(220) nullable | url-friendly |
| description | text nullable | mô tả |
| goal_type | enum | `short_term`, `mid_term`, `long_term` |
| priority | enum | `low`, `medium`, `high`, `critical` |
| status | enum | `not_started`, `in_progress`, `completed`, `paused`, `cancelled` |
| progress_percentage | decimal(5,2) default 0 | tiến độ |
| start_date | date nullable | ngày bắt đầu |
| target_date | date nullable | deadline |
| completed_at | datetime nullable | ngày hoàn thành |
| success_metric | varchar(255) nullable | tiêu chí đo lường |
| outcome_note | text nullable | ghi chú kết quả cuối |
| note | longtext nullable | ghi chú chiến lược |
| is_archived | boolean default false | lưu trữ |
| is_recurring | boolean default false | mục tiêu lặp lại |
| recurrence_rule | json nullable | metadata lặp lại |
| sort_order | int default 0 | sắp xếp |
| created_at | timestamp | audit |
| updated_at | timestamp | audit |
| deleted_at | timestamp nullable | soft delete |

Index nên có:
- index `(user_id, status)`
- index `(user_id, goal_type)`
- index `(user_id, priority)`
- index `(user_id, target_date)`
- index `(user_id, is_archived)`
- fulltext `title, description` nếu cấu hình MySQL hỗ trợ

#### milestones
| Cột | Kiểu dữ liệu | Ghi chú |
|---|---|---|
| id | bigint unsigned | PK |
| user_id | bigint unsigned | FK users |
| goal_id | bigint unsigned | FK goals |
| title | varchar(180) | bắt buộc |
| description | text nullable | mô tả |
| status | enum | `not_started`, `in_progress`, `completed`, `paused` |
| progress_percentage | decimal(5,2) default 0 | tiến độ |
| start_date | date nullable | optional |
| target_date | date nullable | deadline |
| completed_at | datetime nullable | ngày hoàn thành |
| sequence_no | int unsigned default 1 | thứ tự hiển thị |
| checklist_json | json nullable | checklist MVP |
| note | text nullable | ghi chú |
| created_at | timestamp | audit |
| updated_at | timestamp | audit |
| deleted_at | timestamp nullable | soft delete |

Index nên có:
- index `(goal_id, sequence_no)`
- index `(user_id, status)`
- index `(user_id, target_date)`

#### tasks
| Cột | Kiểu dữ liệu | Ghi chú |
|---|---|---|
| id | bigint unsigned | PK |
| user_id | bigint unsigned | FK users |
| goal_id | bigint unsigned | FK goals |
| milestone_id | bigint unsigned nullable | FK milestones |
| parent_task_id | bigint unsigned nullable | hỗ trợ subtask tương lai |
| title | varchar(180) | bắt buộc |
| description | text nullable | mô tả |
| status | enum | `not_started`, `in_progress`, `completed`, `paused` |
| priority | enum | `low`, `medium`, `high`, `critical` |
| progress_percentage | decimal(5,2) default 0 | MVP có thể 0 hoặc 100 |
| due_at | datetime nullable | deadline |
| started_at | datetime nullable | bắt đầu làm |
| completed_at | datetime nullable | hoàn thành |
| estimated_minutes | int unsigned nullable | dự kiến |
| actual_minutes | int unsigned nullable | thực tế |
| is_focus | boolean default false | focus task |
| sort_order | int default 0 | thứ tự |
| metadata | json nullable | mở rộng |
| created_at | timestamp | audit |
| updated_at | timestamp | audit |
| deleted_at | timestamp nullable | soft delete |

Index nên có:
- index `(user_id, status)`
- index `(goal_id, milestone_id)`
- index `(user_id, due_at)`
- index `(user_id, priority)`
- index `(user_id, is_focus)`
- index `(parent_task_id)`

#### habits
| Cột | Kiểu dữ liệu | Ghi chú |
|---|---|---|
| id | bigint unsigned | PK |
| user_id | bigint unsigned | FK users |
| goal_id | bigint unsigned nullable | liên kết goal |
| title | varchar(180) | bắt buộc |
| description | text nullable | mô tả |
| frequency | enum | `daily`, `weekly`, `monthly` |
| target_count | int unsigned default 1 | số lần mục tiêu mỗi chu kỳ |
| unit | varchar(50) default 'times' | đơn vị |
| reminder_time | time nullable | giờ nhắc |
| current_streak | int unsigned default 0 | streak hiện tại |
| best_streak | int unsigned default 0 | streak cao nhất |
| last_logged_at | datetime nullable | log gần nhất |
| status | enum | `active`, `paused`, `completed`, `archived` |
| start_date | date nullable | ngày bắt đầu |
| end_date | date nullable | ngày kết thúc |
| created_at | timestamp | audit |
| updated_at | timestamp | audit |
| deleted_at | timestamp nullable | soft delete |

Index nên có:
- index `(user_id, status)`
- index `(goal_id)`
- index `(user_id, frequency)`
- index `(user_id, reminder_time)`

#### habit_logs
| Cột | Kiểu dữ liệu | Ghi chú |
|---|---|---|
| id | bigint unsigned | PK |
| user_id | bigint unsigned | FK users |
| habit_id | bigint unsigned | FK habits |
| log_date | date | ngày log |
| completed_count | int unsigned default 0 | số lần hoàn thành |
| target_count_snapshot | int unsigned default 1 | chụp target tại thời điểm log |
| is_completed | boolean default false | hoàn thành hay chưa |
| note | text nullable | ghi chú |
| created_at | timestamp | audit |
| updated_at | timestamp | audit |

Index nên có:
- unique `(habit_id, log_date)`
- index `(user_id, log_date)`
- index `(user_id, is_completed)`

#### categories
| Cột | Kiểu dữ liệu | Ghi chú |
|---|---|---|
| id | bigint unsigned | PK |
| user_id | bigint unsigned nullable | null = category hệ thống |
| name | varchar(100) | bắt buộc |
| slug | varchar(120) nullable | optional |
| color | varchar(20) nullable | màu chip |
| icon | varchar(50) nullable | icon key |
| type | enum | `goal`, `task`, `habit`, `all` |
| created_at | timestamp | audit |
| updated_at | timestamp | audit |
| deleted_at | timestamp nullable | soft delete |

Index nên có:
- unique `(user_id, name, type)`
- index `type`

#### tags
| Cột | Kiểu dữ liệu | Ghi chú |
|---|---|---|
| id | bigint unsigned | PK |
| user_id | bigint unsigned | FK users |
| name | varchar(60) | bắt buộc |
| color | varchar(20) nullable | màu |
| created_at | timestamp | audit |
| updated_at | timestamp | audit |
| deleted_at | timestamp nullable | soft delete |

Index nên có:
- unique `(user_id, name)`

#### goal_tag
| Cột | Kiểu dữ liệu | Ghi chú |
|---|---|---|
| goal_id | bigint unsigned | FK goals |
| tag_id | bigint unsigned | FK tags |
| created_at | timestamp | optional |

Index nên có:
- unique `(goal_id, tag_id)`
- index `tag_id`

#### goal_category
| Cột | Kiểu dữ liệu | Ghi chú |
|---|---|---|
| goal_id | bigint unsigned | FK goals |
| category_id | bigint unsigned | FK categories |
| created_at | timestamp | optional |

Index nên có:
- unique `(goal_id, category_id)`

#### goal_logs
| Cột | Kiểu dữ liệu | Ghi chú |
|---|---|---|
| id | bigint unsigned | PK |
| user_id | bigint unsigned | FK users |
| goal_id | bigint unsigned | FK goals |
| milestone_id | bigint unsigned nullable | FK milestones |
| task_id | bigint unsigned nullable | FK tasks |
| log_type | enum | `progress_update`, `status_change`, `note`, `risk`, `completion`, `ai_suggestion` |
| title | varchar(180) nullable | tiêu đề ngắn |
| content | longtext nullable | nội dung |
| old_value | json nullable | dữ liệu cũ |
| new_value | json nullable | dữ liệu mới |
| progress_snapshot | decimal(5,2) nullable | snapshot tiến độ |
| logged_at | datetime | thời điểm log |
| created_at | timestamp | audit |
| updated_at | timestamp | audit |

Index nên có:
- index `(goal_id, logged_at)`
- index `(user_id, log_type)`
- index `(milestone_id)`
- index `(task_id)`

#### reminders
| Cột | Kiểu dữ liệu | Ghi chú |
|---|---|---|
| id | bigint unsigned | PK |
| user_id | bigint unsigned | FK users |
| remindable_type | varchar(120) | morph type |
| remindable_id | bigint unsigned | morph id |
| title | varchar(180) | tiêu đề |
| message | text nullable | nội dung |
| remind_at | datetime | thời điểm nhắc |
| channel | enum | `in_app`, `email`, `push` |
| status | enum | `pending`, `sent`, `cancelled`, `failed` |
| sent_at | datetime nullable | thời điểm gửi thực tế |
| created_at | timestamp | audit |
| updated_at | timestamp | audit |
| deleted_at | timestamp nullable | soft delete |

Index nên có:
- index `(user_id, remind_at)`
- index `(status, remind_at)`
- morph index `(remindable_type, remindable_id)`

#### notifications
| Cột | Kiểu dữ liệu | Ghi chú |
|---|---|---|
| id | uuid hoặc char(36) | PK |
| user_id | bigint unsigned | FK users |
| type | varchar(150) | loại notification |
| title | varchar(180) | tiêu đề |
| body | text nullable | nội dung |
| data | json nullable | payload |
| read_at | datetime nullable | đã đọc |
| created_at | timestamp | audit |
| updated_at | timestamp | audit |

Index nên có:
- index `(user_id, read_at)`
- index `(user_id, created_at)`

#### journal_entries
| Cột | Kiểu dữ liệu | Ghi chú |
|---|---|---|
| id | bigint unsigned | PK |
| user_id | bigint unsigned | FK users |
| goal_id | bigint unsigned nullable | goal liên quan |
| entry_date | date | ngày nhật ký |
| title | varchar(180) nullable | tiêu đề |
| content | longtext | bắt buộc |
| mood_score | tinyint unsigned nullable | 1-5 |
| energy_score | tinyint unsigned nullable | 1-5 |
| productivity_score | tinyint unsigned nullable | 1-10 |
| blockers | text nullable | khó khăn |
| wins | text nullable | điểm tốt |
| next_steps | text nullable | bước tiếp theo |
| created_at | timestamp | audit |
| updated_at | timestamp | audit |
| deleted_at | timestamp nullable | soft delete |

Index nên có:
- index `(user_id, entry_date)`
- index `(goal_id, entry_date)`

#### attachments
| Cột | Kiểu dữ liệu | Ghi chú |
|---|---|---|
| id | bigint unsigned | PK |
| user_id | bigint unsigned | FK users |
| attachable_type | varchar(120) | morph type |
| attachable_id | bigint unsigned | morph id |
| disk | varchar(50) | local, s3 |
| path | varchar(255) | đường dẫn file |
| original_name | varchar(255) | tên gốc |
| mime_type | varchar(120) nullable | loại file |
| file_size | bigint unsigned | byte |
| created_at | timestamp | audit |
| updated_at | timestamp | audit |
| deleted_at | timestamp nullable | soft delete |

Index nên có:
- morph index `(attachable_type, attachable_id)`
- index `(user_id, created_at)`

#### goal_templates
| Cột | Kiểu dữ liệu | Ghi chú |
|---|---|---|
| id | bigint unsigned | PK |
| user_id | bigint unsigned nullable | null = template hệ thống |
| name | varchar(180) | bắt buộc |
| description | text nullable | mô tả |
| category_id | bigint unsigned nullable | category gợi ý |
| goal_type | enum | cùng enum goals |
| estimated_duration_days | int unsigned nullable | gợi ý thời lượng |
| template_payload | json | cấu trúc template |
| is_public | boolean default false | có chia sẻ được không |
| created_at | timestamp | audit |
| updated_at | timestamp | audit |
| deleted_at | timestamp nullable | soft delete |

Index nên có:
- index `(user_id, is_public)`
- index `(category_id)`

### 3.5 Quan hệ giữa các bảng
- `users` có nhiều `goals`, `milestones`, `tasks`, `habits`, `habit_logs`, `journal_entries`, `reminders`, `notifications`, `attachments`, `tags`.
- `goals` thuộc về `users`, có thể thuộc `category`, có nhiều `milestones`, `tasks`, `habits`, `goal_logs`, `attachments`.
- `goals` có quan hệ many-to-many với `tags`.
- `milestones` thuộc `goals`, có nhiều `tasks`, `goal_logs`, `attachments`.
- `tasks` thuộc `goals`, có thể thuộc `milestones`, có thể có `parent_task_id`.
- `habits` thuộc `users`, có thể gắn với `goals`, có nhiều `habit_logs`.
- `journal_entries` thuộc `users`, có thể gắn với `goals`.
- `reminders` là quan hệ polymorphic tới `goal`, `milestone`, `task`, `habit`.
- `attachments` là polymorphic tới `goal`, `milestone`, `task`, `journal_entry`.

### 3.6 Gợi ý migration cho Laravel
Thứ tự nên tạo migration:
1. `users`
2. `cache`, `jobs`, `personal_access_tokens`
3. `categories`, `tags`, `user_settings`
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
15. `goal_tag`, `goal_category`, `task_tag`

Khuyến nghị khi viết migration:
- Dùng `softDeletes()` cho bảng người dùng tạo ra.
- Dùng `cascadeOnDelete()` cho quan hệ ownership chặt.
- Dùng `nullOnDelete()` nếu muốn giữ lịch sử mà không xóa chuỗi dữ liệu.
- Dùng unique index cho:
  - `habit_logs(habit_id, log_date)`
  - `tags(user_id, name)`
  - `categories(user_id, name, type)`

## 4. Thiết kế API

### 4.1 Quy ước API chung
- Base path: `/api/v1`
- Content type: `application/json`
- Auth: Sanctum bearer token ở MVP
- Response phân trang:
  - `data`
  - `links`
  - `meta`
- Query params phổ biến:
  - `page`, `per_page`
  - `search`
  - `sort`
  - `filter[status]`
  - `filter[priority]`
  - `filter[goal_type]`
  - `filter[target_date_from]`
  - `filter[target_date_to]`
  - `include=milestones,tags`

### 4.2 Mẫu response chuẩn

#### Success
```json
{
  "success": true,
  "message": "Tạo mục tiêu thành công.",
  "data": {
    "id": 101,
    "title": "Learn React Advanced",
    "status": "not_started"
  }
}
```

#### Validation error
```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ.",
  "errors": {
    "title": [
      "Trường title là bắt buộc."
    ]
  }
}
```

### 4.3 Auth và profile endpoints

| Method | URL | Auth | Mục đích |
|---|---|---|---|
| POST | `/auth/register` | Không | Đăng ký |
| POST | `/auth/login` | Không | Đăng nhập |
| POST | `/auth/forgot-password` | Không | Gửi email reset |
| POST | `/auth/reset-password` | Không | Đặt lại mật khẩu |
| POST | `/auth/logout` | Có | Đăng xuất thiết bị hiện tại |
| POST | `/auth/logout-all` | Có | Đăng xuất mọi thiết bị |
| GET | `/auth/me` | Có | Lấy thông tin user hiện tại |
| PATCH | `/profile` | Có | Cập nhật hồ sơ |
| PATCH | `/profile/password` | Có | Đổi mật khẩu |
| POST | `/profile/avatar` | Có | Upload avatar |

Validation chính:
- register:
  - `name`: `required|string|max:150`
  - `email`: `required|email|max:190|unique:users,email`
  - `password`: `required|string|min:8|confirmed`
- login:
  - `email`: `required|email`
  - `password`: `required|string`
- update profile:
  - `name`: `required|string|max:150`
  - `timezone`: `nullable|string|max:64`
  - `locale`: `nullable|in:vi,en`
  - `theme`: `nullable|in:light,dark,system`

Permission logic:
- User chỉ được xem và chỉnh sửa hồ sơ của chính họ.

Ví dụ request đăng ký:
```json
{
  "name": "Nguyen Van A",
  "email": "a@example.com",
  "password": "secret123",
  "password_confirmation": "secret123"
}
```

### 4.4 Dashboard endpoints

| Method | URL | Auth | Mục đích |
|---|---|---|---|
| GET | `/dashboard/summary` | Có | Lấy số liệu tổng quan |
| GET | `/dashboard/upcoming` | Có | Lấy công việc/reminder sắp tới |
| GET | `/dashboard/progress-chart` | Có | Dataset cho biểu đồ tiến độ |
| GET | `/dashboard/focus` | Có | Danh sách việc trọng tâm |

Response nên gồm:
- `active_goals`
- `completed_goals`
- `tasks_due_today`
- `overdue_tasks`
- `habit_completion_today`
- `performance_score`
- `upcoming_items`

### 4.5 Goal endpoints

| Method | URL | Auth | Mục đích |
|---|---|---|---|
| GET | `/goals` | Có | Danh sách goal |
| POST | `/goals` | Có | Tạo goal |
| GET | `/goals/{goal}` | Có | Chi tiết goal |
| PATCH | `/goals/{goal}` | Có | Cập nhật goal |
| DELETE | `/goals/{goal}` | Có | Xóa mềm goal |
| POST | `/goals/{goal}/archive` | Có | Lưu trữ goal |
| POST | `/goals/{goal}/duplicate` | Có | Nhân bản goal |
| GET | `/goals/{goal}/timeline` | Có | Timeline hoạt động |
| GET | `/goals/{goal}/logs` | Có | Lịch sử log |
| POST | `/goals/{goal}/progress-log` | Có | Ghi log tiến độ |

Ví dụ request tạo goal:
```json
{
  "title": "Pass IELTS 7.0",
  "description": "Mục tiêu trong 6 tháng.",
  "goal_type": "mid_term",
  "priority": "high",
  "status": "not_started",
  "start_date": "2026-04-10",
  "target_date": "2026-10-10",
  "category_id": 2,
  "tag_ids": [1, 5],
  "success_metric": "Overall IELTS >= 7.0",
  "note": "Cần tập trung nhiều vào writing."
}
```

Validation:
- `title`: `required|string|max:180`
- `description`: `nullable|string`
- `goal_type`: `required|in:short_term,mid_term,long_term`
- `priority`: `required|in:low,medium,high,critical`
- `status`: `required|in:not_started,in_progress,completed,paused,cancelled`
- `start_date`: `nullable|date`
- `target_date`: `nullable|date|after_or_equal:start_date`
- `category_id`: `nullable|exists:categories,id`
- `tag_ids`: `nullable|array`
- `tag_ids.*`: `exists:tags,id`

Permission logic:
- User chỉ truy cập được goal có `goal.user_id === auth()->id()`.

### 4.6 Milestone endpoints

| Method | URL | Auth | Mục đích |
|---|---|---|---|
| GET | `/goals/{goal}/milestones` | Có | Danh sách milestone của goal |
| POST | `/goals/{goal}/milestones` | Có | Tạo milestone |
| GET | `/milestones/{milestone}` | Có | Chi tiết milestone |
| PATCH | `/milestones/{milestone}` | Có | Cập nhật milestone |
| DELETE | `/milestones/{milestone}` | Có | Xóa mềm milestone |
| POST | `/milestones/{milestone}/reorder` | Có | Sắp xếp lại thứ tự |
| POST | `/milestones/{milestone}/complete` | Có | Đánh dấu hoàn thành |

Validation:
- `title`: `required|string|max:180`
- `status`: `required|in:not_started,in_progress,completed,paused`
- `target_date`: `nullable|date`
- `sequence_no`: `nullable|integer|min:1`
- `checklist_json`: `nullable|array`

### 4.7 Task endpoints

| Method | URL | Auth | Mục đích |
|---|---|---|---|
| GET | `/tasks` | Có | Danh sách task toàn hệ thống của user |
| POST | `/milestones/{milestone}/tasks` | Có | Tạo task trong milestone |
| GET | `/tasks/{task}` | Có | Chi tiết task |
| PATCH | `/tasks/{task}` | Có | Cập nhật task |
| DELETE | `/tasks/{task}` | Có | Xóa mềm task |
| POST | `/tasks/{task}/complete` | Có | Đánh dấu hoàn thành |
| POST | `/tasks/reorder` | Có | Reorder hàng loạt |
| POST | `/tasks/bulk-status` | Có | Đổi trạng thái hàng loạt |
| POST | `/tasks/{task}/focus` | Có | Bật/tắt focus |

Ví dụ request tạo task:
```json
{
  "goal_id": 10,
  "title": "Practice Writing Task 2",
  "description": "Mỗi 2 ngày viết 1 bài.",
  "status": "not_started",
  "priority": "high",
  "due_at": "2026-04-15 20:00:00",
  "estimated_minutes": 60,
  "is_focus": true
}
```

Validation:
- `goal_id`: `required|exists:goals,id`
- `title`: `required|string|max:180`
- `status`: `required|in:not_started,in_progress,completed,paused`
- `priority`: `required|in:low,medium,high,critical`
- `due_at`: `nullable|date`
- `estimated_minutes`: `nullable|integer|min:1|max:1440`
- `is_focus`: `boolean`

### 4.8 Habit endpoints

| Method | URL | Auth | Mục đích |
|---|---|---|---|
| GET | `/habits` | Có | Danh sách habit |
| POST | `/habits` | Có | Tạo habit |
| GET | `/habits/{habit}` | Có | Chi tiết habit |
| PATCH | `/habits/{habit}` | Có | Cập nhật habit |
| DELETE | `/habits/{habit}` | Có | Xóa mềm habit |
| POST | `/habits/{habit}/logs` | Có | Log hoàn thành |
| GET | `/habits/{habit}/logs` | Có | Lịch sử log |
| GET | `/habits/today` | Có | Tracker habit hôm nay |

Ví dụ request tạo habit:
```json
{
  "goal_id": 10,
  "title": "Study English 45 minutes",
  "frequency": "daily",
  "target_count": 1,
  "unit": "times",
  "reminder_time": "19:00:00",
  "start_date": "2026-04-10"
}
```

Ví dụ request log habit:
```json
{
  "log_date": "2026-04-10",
  "completed_count": 1,
  "note": "Hoàn thành sau bữa tối."
}
```

Validation:
- create habit:
  - `goal_id`: `nullable|exists:goals,id`
  - `title`: `required|string|max:180`
  - `frequency`: `required|in:daily,weekly,monthly`
  - `target_count`: `required|integer|min:1`
  - `unit`: `nullable|string|max:50`
  - `reminder_time`: `nullable|date_format:H:i:s`
- log habit:
  - `log_date`: `required|date`
  - `completed_count`: `required|integer|min:0`
  - `note`: `nullable|string`

### 4.9 Category và tag endpoints

| Method | URL | Auth | Mục đích |
|---|---|---|---|
| GET | `/categories` | Có | Danh sách category |
| POST | `/categories` | Có | Tạo category |
| PATCH | `/categories/{category}` | Có | Cập nhật category |
| DELETE | `/categories/{category}` | Có | Xóa category |
| GET | `/tags` | Có | Danh sách tags |
| POST | `/tags` | Có | Tạo tag |
| PATCH | `/tags/{tag}` | Có | Cập nhật tag |
| DELETE | `/tags/{tag}` | Có | Xóa tag |

### 4.10 Journal endpoints

| Method | URL | Auth | Mục đích |
|---|---|---|---|
| GET | `/journal-entries` | Có | Danh sách nhật ký |
| POST | `/journal-entries` | Có | Tạo nhật ký |
| GET | `/journal-entries/{entry}` | Có | Chi tiết |
| PATCH | `/journal-entries/{entry}` | Có | Cập nhật |
| DELETE | `/journal-entries/{entry}` | Có | Xóa mềm |

Validation:
- `entry_date`: `required|date`
- `content`: `required|string`
- `mood_score`: `nullable|integer|min:1|max:5`
- `energy_score`: `nullable|integer|min:1|max:5`
- `productivity_score`: `nullable|integer|min:1|max:10`

### 4.11 Reminder và notification endpoints

| Method | URL | Auth | Mục đích |
|---|---|---|---|
| GET | `/reminders` | Có | Danh sách reminder |
| POST | `/reminders` | Có | Tạo reminder |
| PATCH | `/reminders/{reminder}` | Có | Cập nhật reminder |
| DELETE | `/reminders/{reminder}` | Có | Xóa reminder |
| GET | `/notifications` | Có | Danh sách notification |
| POST | `/notifications/{id}/read` | Có | Đánh dấu đã đọc |
| POST | `/notifications/read-all` | Có | Đánh dấu đọc tất cả |

Reminder validation:
- `remindable_type`: `required|in:goal,milestone,task,habit`
- `remindable_id`: `required|integer`
- `title`: `required|string|max:180`
- `remind_at`: `required|date|after:now`
- `channel`: `required|in:in_app,email,push`

### 4.12 Report endpoints

| Method | URL | Auth | Mục đích |
|---|---|---|---|
| GET | `/reports/weekly` | Có | Báo cáo tuần |
| GET | `/reports/monthly` | Có | Báo cáo tháng |
| GET | `/reports/quarterly` | Có | Báo cáo quý |
| GET | `/reports/performance-score` | Có | Phân tích điểm hiệu suất |
| GET | `/reports/charts/completion-trend` | Có | Dataset chart tiến độ |
| GET | `/reports/charts/habit-consistency` | Có | Dataset habit chart |

Query params:
- `from`
- `to`
- `category_id`
- `goal_id`

### 4.13 Attachment và template endpoints

| Method | URL | Auth | Mục đích |
|---|---|---|---|
| POST | `/attachments` | Có | Upload file |
| DELETE | `/attachments/{attachment}` | Có | Xóa file |
| GET | `/goal-templates` | Có | Danh sách template |
| POST | `/goal-templates` | Có | Tạo template |
| GET | `/goal-templates/{template}` | Có | Chi tiết template |
| POST | `/goal-templates/{template}/apply` | Có | Tạo goal từ template |

### 4.14 AI endpoints cho phase nâng cao

| Method | URL | Auth | Mục đích |
|---|---|---|---|
| POST | `/ai/goal-breakdown` | Có | AI chia goal thành lộ trình |
| POST | `/ai/goal-estimate` | Có | AI ước lượng thời gian |
| POST | `/ai/risk-analysis` | Có | AI cảnh báo rủi ro |
| POST | `/ai/habit-suggestions` | Có | AI gợi ý habit |

### 4.15 Auth middleware và permission logic
- Tất cả endpoint trừ auth public đều nằm trong `auth:sanctum`.
- Dùng `Policies` cho từng model:
  - `GoalPolicy`
  - `MilestonePolicy`
  - `TaskPolicy`
  - `HabitPolicy`
  - `JournalEntryPolicy`
  - `ReminderPolicy`
  - `AttachmentPolicy`
- Rule chung:
  - chỉ truy cập record có `user_id` trùng user hiện tại
  - template hệ thống `user_id = null` và `is_public = true` cho phép đọc

## 5. Kế hoạch giao diện và component frontend

### 5.1 Kiến trúc frontend đề xuất
- Chuyển từ cấu trúc route-based sang feature-based.
- Tách rõ:
  - `server state` qua TanStack Query
  - `UI state` qua Zustand
  - `form state` qua React Hook Form
- Visual component càng “dumb” càng tốt, business logic đặt trong `hooks` và `services`.

### 5.2 Danh sách page cần có

#### Public pages
- Landing page
- Login page
- Register page
- Forgot password page
- Reset password page

#### Private pages
- Dashboard
- Goals list
- Goal create/edit
- Goal detail
- Tasks board/list
- Calendar
- Habits
- Journal
- Reports
- Notifications
- Templates
- Profile/Settings

### 5.3 Bố cục tổng thể từng nhóm trang

#### AuthLayout
- Khung giữa màn hình.
- Form card đơn giản.
- Background nhẹ, tối giản.
- Logo + title + subtitle.

#### AppLayout
- Sidebar trái cho desktop.
- Topbar trên cùng.
- Content panel chính.
- Mobile dùng drawer hoặc bottom nav tối giản.

#### DashboardLayout
- Grid widget 12 cột ở desktop.
- 2 cột ở tablet.
- 1 cột ở mobile.

#### GoalDetailLayout
- Header summary ở trên.
- Tabs bên dưới:
  - Overview
  - Milestones
  - Tasks
  - Notes
  - Journal
  - History
- Panel phụ bên phải cho reminder, tags, habits liên quan.

### 5.4 Thiết kế chi tiết theo từng trang

#### Landing page
- Hero section
- Giá trị cốt lõi
- Ảnh minh họa hoặc mock dashboard
- CTA đăng ký
- Footer

#### Dashboard
- Summary cards
- Today agenda
- Goal progress chart
- Habit streak widget
- Upcoming deadlines
- Performance score card
- Recent journal widget

#### Goals list
- Toolbar:
  - search
  - filter
  - sort
  - create goal
- Toggle card/table view
- Pagination
- Empty state nếu chưa có goal

#### Goal detail
- Header:
  - title
  - badge trạng thái
  - priority
  - progress ring/bar
  - due date
  - action buttons
- Tabs:
  - overview
  - milestones
  - tasks
  - notes
  - journal
  - history

#### Tasks page
- Task board dạng cột theo trạng thái hoặc list mode.
- Filter theo:
  - goal
  - priority
  - due date
  - focus
- Drawer để tạo/sửa task nhanh.

#### Calendar page
- Day/week/month switch.
- Event color theo loại entity.
- Quick add reminder/task.

#### Habits page
- Today tracker
- Habit cards
- Habit history
- Streak summary

#### Reports page
- Bộ lọc thời gian
- KPI
- Completion trend chart
- Category breakdown chart
- Habit consistency chart
- Hiển thị performance score và giải thích cách tính

### 5.5 Component tree chi tiết
```text
App
  AppProviders
    RouterProvider
      PublicRoutes
        LandingPage
        LoginPage
        RegisterPage
        ForgotPasswordPage
        ResetPasswordPage
      ProtectedRoutes
        AppLayout
          Sidebar
          Topbar
          ContentOutlet
            DashboardPage
              SummaryCards
              AgendaWidget
              GoalProgressChart
              HabitStreakWidget
              UpcomingDeadlinesWidget
              PerformanceScoreCard
            GoalsPage
              GoalToolbar
              GoalFilterBar
              GoalList
                GoalCard
            GoalDetailPage
              GoalHeader
              GoalTabs
                OverviewTab
                MilestoneBoard
                  MilestoneCard
                  TaskList
                    TaskItem
                NotesTab
                JournalTab
                HistoryTab
            TasksPage
              TaskBoard
              TaskColumn
              TaskDrawer
            HabitsPage
              HabitTrackerHeader
              HabitCardList
              HabitLogCalendar
            ReportsPage
              ReportFilters
              KPIGrid
              CompletionChart
              HabitChart
              CategoryChart
            SettingsPage
              ProfileForm
              ThemeSettings
              LanguageSettings
              SecuritySettings
```

### 5.6 State management đề xuất

#### TanStack Query cho server state
- auth current user
- dashboard summary
- goals list/detail
- milestones
- tasks
- habits và habit logs
- notifications
- reports

#### Zustand cho UI state
- sidebar collapsed
- theme
- active filters
- current calendar mode
- modal/drawer open state
- focus mode

#### React Hook Form cho form state
- login/register
- profile
- create/edit goal
- create/edit milestone
- create/edit task
- create/edit habit
- journal entry

### 5.7 Form validation phía frontend
- Dùng `Zod schema` tương ứng với backend validation.
- Các rule validate chính:
  - bắt buộc nhập trường cần thiết
  - max length
  - enum hợp lệ
  - ngày kết thúc không nhỏ hơn ngày bắt đầu
  - password confirmation khớp
- Backend vẫn là nguồn kiểm tra cuối cùng.

### 5.8 Tổ chức hooks, services, API client

#### API client
- `src/lib/api/client.ts`
- Chứa:
  - `baseURL`
  - request interceptor gắn token
  - response interceptor xử lý 401, 422, 500
  - chuẩn hóa lỗi trả về

#### Feature services
- `features/auth/api/authApi.ts`
- `features/goals/api/goalsApi.ts`
- `features/tasks/api/tasksApi.ts`
- `features/habits/api/habitsApi.ts`
- `features/reports/api/reportsApi.ts`

#### Hooks
- `useAuth`
- `useGoals`
- `useGoalDetail`
- `useCreateGoal`
- `useMilestones`
- `useTasks`
- `useHabitTracker`
- `useDashboardSummary`
- `usePerformanceReport`

### 5.9 Cách tái sử dụng component

#### `components/ui`
- `Button`
- `Input`
- `Textarea`
- `Select`
- `DatePicker`
- `Badge`
- `ProgressBar`
- `Modal`
- `Drawer`
- `Tabs`
- `Card`
- `EmptyState`
- `Tooltip`

#### `components/layout`
- `Sidebar`
- `Topbar`
- `AppShell`
- `SectionHeader`

#### `components/charts`
- `LineTrendChart`
- `DonutProgressChart`
- `BarComparisonChart`

### 5.10 Cách xây dashboard và biểu đồ
- Không nên fetch quá nhiều endpoint nhỏ lẻ cho dashboard.
- Nên có endpoint tổng hợp riêng:
  - `/dashboard/summary`
  - `/dashboard/upcoming`
  - `/dashboard/progress-chart`
- Biểu đồ khuyến nghị:
  - line chart: completion trend theo tuần
  - donut chart: goal status breakdown
  - bar chart: habit consistency
  - stacked bar: completed vs overdue tasks

### 5.11 Định hướng UI/UX
- Giao diện hiện đại, tối giản, không rối.
- Ưu tiên desktop-first với layout rộng, rõ, tập trung vào năng suất.
- Mobile vẫn responsive nhưng không hy sinh trải nghiệm desktop.
- Màu trạng thái nên nhất quán:
  - `not_started`: neutral
  - `in_progress`: blue
  - `completed`: green
  - `paused`: amber
  - `overdue/risk`: red

## 6. Cấu trúc backend

### 6.1 Tổ chức backend Laravel
- Controllers:
  - `App\Http\Controllers\Api\V1\AuthController`
  - `ProfileController`
  - `DashboardController`
  - `GoalController`
  - `MilestoneController`
  - `TaskController`
  - `HabitController`
  - `ReminderController`
  - `NotificationController`
  - `JournalEntryController`
  - `ReportController`
  - `GoalTemplateController`
- Requests:
  - `StoreGoalRequest`
  - `UpdateGoalRequest`
  - `StoreMilestoneRequest`
  - `UpdateMilestoneRequest`
  - `StoreTaskRequest`
  - `UpdateTaskRequest`
  - `StoreHabitRequest`
  - `StoreJournalEntryRequest`
- Resources:
  - `GoalResource`
  - `GoalDetailResource`
  - `MilestoneResource`
  - `TaskResource`
  - `HabitResource`
  - `DashboardSummaryResource`
- Services:
  - `GoalProgressService`
  - `HabitStreakService`
  - `ReminderService`
  - `PerformanceScoreService`
  - `ReportAggregationService`
  - `TemplateApplyService`
  - `AiPlanningService` ở phase nâng cao
- Jobs:
  - `SendReminderJob`
  - `GenerateWeeklyReportJob`
  - `GenerateExportJob`
  - `RunOverdueScanJob`
  - `AnalyzeGoalRiskJob`
- Policies:
  - ownership-based access

### 6.2 Quy tắc nghiệp vụ nên đặt ở backend
- Goal chỉ được auto-complete khi các milestone quan trọng đã hoàn tất.
- Milestone auto-complete khi toàn bộ task con hoàn thành.
- Khi task chuyển sang `completed`, backend phải:
  - set `completed_at`
  - recalc milestone progress
  - recalc goal progress
  - ghi `goal_logs`
- Habit log không được trùng `habit_id + log_date`.
- Reminder pending phải bị hủy nếu entity cha đã bị xóa hoặc đã completed và reminder không còn ý nghĩa.

### 6.3 Các module backend theo trách nhiệm
- Auth module:
  - register, login, forgot/reset password, logout
- Profile module:
  - profile, avatar, preferences, password change
- Goal module:
  - goals, milestones, tasks, logs, templates, progress
- Habit module:
  - habits, logs, streaks
- Planning module:
  - calendar, reminders, recurring schedules
- Insights module:
  - dashboard, reports, performance score
- Notification module:
  - database notifications, email hooks
- AI module:
  - breakdown, estimate, risk analysis, recommendations

### 6.4 Tổ chức route API đề xuất
```php
Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('register', ...);
        Route::post('login', ...);
        Route::post('forgot-password', ...);
        Route::post('reset-password', ...);
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('auth/me', ...);
        Route::patch('profile', ...);
        Route::apiResource('goals', GoalController::class);
        Route::post('goals/{goal}/milestones', ...);
        Route::apiResource('milestones', MilestoneController::class)->except(['index', 'store']);
        Route::apiResource('tasks', TaskController::class);
        Route::apiResource('habits', HabitController::class);
        Route::apiResource('journal-entries', JournalEntryController::class);
        Route::get('dashboard/summary', ...);
        Route::get('reports/weekly', ...);
    });
});
```

### 6.5 Mapping với codebase hiện tại
- Backend hiện có sẵn:
  - Laravel 12
  - Sanctum
  - auth register/login/logout cơ bản
  - model `Goal`, `Task`, `Habit`
- Khoảng cách so với target architecture:
  - chưa có `milestones`
  - task schema đang mang dấu vết từ mô hình `project/task` cũ
  - route chưa version hóa
  - controller và model còn mang tính thử nghiệm
- Hướng làm hợp lý:
  - không cố vá chắp nối schema cũ
  - tạo domain model chuẩn mới
  - giữ những phần dùng được như auth, user, sanctum foundation

## 7. Lộ trình phát triển

### Phase 1: MVP
Mục tiêu:
Ra mắt bản có thể dùng được để quản lý mục tiêu cá nhân từ goal đến task và theo dõi tiến độ cơ bản.

Chức năng cần làm:
- auth + profile
- goals CRUD
- milestones CRUD
- tasks CRUD
- categories/tags
- dashboard summary
- search/filter
- calendar basic view
- goal note + goal logs

Ưu tiên:
- rất cao

Mức độ khó:
- trung bình

Phụ thuộc kỹ thuật:
- schema chuẩn hóa
- Sanctum auth
- progress service
- UI kit tái sử dụng

Kết quả đầu ra:
- một MVP chạy end-to-end
- API v1 ổn định
- UI desktop-first responsive
- demo data và test cho luồng chính

### Phase 2: Bổ sung tính năng trung cấp
Mục tiêu:
Tăng khả năng duy trì thói quen, nhịp làm việc và review cá nhân.

Chức năng cần làm:
- habits và habit logs
- reminders và notifications
- recurring entities
- journal
- reports cơ bản
- biểu đồ
- focus mode
- milestone checklist
- edit history
- performance score

Ưu tiên:
- cao

Mức độ khó:
- trung bình đến cao

Phụ thuộc kỹ thuật:
- queue
- scheduler
- activity logging
- aggregation queries

Kết quả đầu ra:
- sản phẩm dùng hằng ngày có chiều sâu hơn
- báo cáo tuần/tháng sử dụng được

### Phase 3: Nâng cao
Mục tiêu:
Biến sản phẩm thành nền tảng năng suất cá nhân mạnh hơn.

Chức năng cần làm:
- goal templates
- export PDF/Excel
- backup/restore
- dark mode
- đa ngôn ngữ
- Google Calendar sync
- analytics sâu hơn

Ưu tiên:
- trung bình

Mức độ khó:
- trung bình đến cao

Phụ thuộc kỹ thuật:
- storage strategy
- export jobs
- OAuth integration
- i18n framework

Kết quả đầu ra:
- bộ tính năng cho power user
- tăng giá trị sử dụng dài hạn

### Phase 4: AI + tự động hóa
Mục tiêu:
Thêm lớp hỗ trợ thông minh để người dùng lập kế hoạch nhanh hơn và hạn chế trễ hạn.

Chức năng cần làm:
- AI goal breakdown
- AI goal estimate
- AI risk analysis
- AI habit suggestion
- AI weekly review summary

Ưu tiên:
- trung bình

Mức độ khó:
- cao

Phụ thuộc kỹ thuật:
- AI service integration
- prompt orchestration
- async jobs
- logging cho feedback loop

Kết quả đầu ra:
- trải nghiệm planning có AI hỗ trợ
- cảnh báo chủ động hơn

### Phase 5: Scale production
Mục tiêu:
Hoàn thiện khả năng vận hành production, độ ổn định và khả năng mở rộng.

Chức năng cần làm:
- observability
- queue scaling
- cache strategy
- search optimization
- S3 storage
- backup retention
- disaster recovery
- admin tools nếu bật public templates

Ưu tiên:
- trung bình

Mức độ khó:
- cao

Phụ thuộc kỹ thuật:
- production infra
- monitoring stack
- managed database
- CDN/object storage

Kết quả đầu ra:
- hệ thống production-ready
- hiệu năng và độ ổn định tốt hơn

## 8. Bảo mật, kiểm thử và triển khai

### 8.1 Bảo mật

#### Auth strategy
- Dùng Sanctum cho bearer token ở MVP.
- Revoke token khi logout.
- Có thể thêm logout all devices về sau.

#### Rate limit
- Login: `5 lần/phút` theo email + IP.
- Forgot password: `3 lần/15 phút`.
- API chung: `60 request/phút/user`.
- AI/export endpoint: rate limit thấp hơn và nên đi qua queue.

#### Input validation
- Toàn bộ request ghi dữ liệu phải dùng `Form Request`.
- Không nhận field thừa ngoài allowlist nếu không cần.

#### Chống XSS/CSRF/SQL Injection
- XSS:
  - React escape output mặc định.
  - Nếu dùng rich text sau này phải sanitize.
- CSRF:
  - Nếu chuyển sang cookie-based Sanctum thì kích hoạt CSRF flow đầy đủ.
- SQL Injection:
  - Dùng Eloquent hoặc Query Builder.
  - Không raw SQL nếu không có binding.

#### Bảo mật file upload
- Validate mime type.
- Validate file size.
- Không cho truy cập public với file private.
- Chỉ lưu metadata trong DB, file nằm ở storage phù hợp.

### 8.2 Logging và error handling
- Log các sự kiện quan trọng:
  - user đăng ký
  - login fail
  - goal created/completed
  - reminder gửi lỗi
  - export start/completed
- Chuẩn hóa JSON error response ở exception handler.
- Thông báo người dùng nên ngắn gọn, log nội bộ giữ chi tiết kỹ thuật.
- Theo dõi queue failed jobs và retry strategy.

### 8.3 Testing strategy

#### Backend unit test
- `GoalProgressService`
- `HabitStreakService`
- `PerformanceScoreService`

#### Backend feature test
- register/login/logout
- profile update
- goal CRUD
- milestone/task lifecycle
- habit logging
- dashboard summary
- policy authorization

#### Backend integration test
- reminder scheduling
- report generation
- export generation
- queued notification flow

#### Frontend test
- auth form validation
- goal create/edit form
- dashboard render với mocked API
- task board interaction

#### End-to-end test
- register -> create goal -> create milestone -> create task -> complete task -> see progress update
- create habit -> log today -> see streak update

### 8.4 Quy chuẩn code

#### Frontend
- `strict TypeScript`
- `ESLint + Prettier`
- tách feature rõ ràng
- không gọi API trực tiếp trong component thuần UI

#### Backend
- `Laravel Pint`
- controller mỏng
- business logic đưa vào service/action
- validation đưa vào request class
- response dùng resource class
- phân quyền qua policy

### 8.5 Môi trường dev / staging / production

#### Development
- frontend local
- backend local
- MySQL local
- Mailpit cho email test
- có seed data

#### Staging
- mirror production càng gần càng tốt
- database và storage riêng
- có dữ liệu demo để QA

#### Production
- HTTPS only
- env management an toàn
- queue workers
- scheduler
- backup tự động

### 8.6 Docker nếu cần
- Nên dùng Docker cho onboarding team.
- Gợi ý service:
  - frontend
  - backend
  - mysql
  - redis
  - mailpit
- Có thể dùng Laravel Sail nếu muốn bắt đầu nhanh từ backend.

### 8.7 CI/CD gợi ý
- Dùng GitHub Actions:
  - frontend: install -> lint -> test -> build
  - backend: composer install -> pint -> test
  - build artifact
  - deploy staging từ nhánh `develop`
  - deploy production từ `main` hoặc tag release

### 8.8 Deploy frontend và backend
- Frontend:
  - Vercel
  - Netlify
  - hoặc static Nginx
- Backend:
  - VPS
  - Laravel Forge
  - Ploi
  - container platform
- Database:
  - managed MySQL nếu có thể
- Redis:
  - cache, queue, rate limit

### 8.9 Storage file
- MVP:
  - local storage/public + private
- Production:
  - S3-compatible storage
- Attachment metadata nằm trong DB, file lưu trong object storage hoặc disk riêng.

### 8.10 Queue và scheduler của Laravel

#### Queue jobs
- gửi reminder
- gửi notification
- tạo report
- tạo file export
- AI analyze/suggest

#### Scheduler jobs
- scan overdue items
- quét reminder sắp đến hạn
- refresh streak
- weekly summary
- monthly summary
- cleanup log/token nếu cần

### 8.11 Sao lưu dữ liệu
- Backup database hằng ngày.
- Backup file attachments.
- Chính sách retention:
  - 7 bản daily
  - 4 bản weekly
  - 6 bản monthly
- Phải có quy trình restore test trên staging.

## 9. Đề xuất bước bắt đầu code ngay

### 9.1 Quyết định kỹ thuật nên chốt ngay
- Giữ `Laravel Sanctum`.
- Chuẩn hóa domain theo `goals -> milestones -> tasks`.
- Nếu chưa chuyển sang Vite ngay được, có thể giữ `react-scripts` trong 1 sprint đầu, nhưng nên chuyển trước Phase 2.
- MVP dùng bearer token để tích hợp nhanh.

### 9.2 Sprint triển khai đầu tiên đề xuất
1. Dọn scope repo hiện tại:
   - đóng băng hoặc loại bỏ các module thử nghiệm không liên quan như `projects`, social/follow, product APIs.
2. Dựng lại schema backend:
   - tạo migrations cho `milestones`, `tasks` chuẩn mới, `categories`, `tags`, `goal_logs`, `journal_entries`, `reminders`, `attachments`, `goal_templates`.
3. Xây nền API v1:
   - `auth/me`
   - `profile`
   - `goals`
   - `milestones`
   - `tasks`
   - `dashboard/summary`
4. Refactor frontend foundation:
   - app layout
   - auth pages
   - goals list
   - goal detail
   - milestone/task form
5. Hoàn thiện core logic:
   - progress calculation
   - policy ownership
   - filter/sort/search
6. Viết test và seed data:
   - auth flow
   - goal lifecycle
   - milestone/task completion

### 9.3 Thứ tự làm file/module hợp lý

#### Backend
1. migrations
2. models + relationships
3. enums
4. requests
5. policies
6. services
7. controllers/resources
8. routes
9. tests

#### Frontend
1. API client
2. auth provider
3. app shell
4. goals list page
5. goal detail page
6. milestone/task components
7. dashboard widgets

### 9.4 Definition of Done cho MVP
- User đăng ký/đăng nhập an toàn.
- User tạo được goal, milestone, task.
- Tiến độ milestone và goal tự cập nhật khi task đổi trạng thái.
- Có dashboard tổng quan cơ bản.
- Có search/filter.
- Có lịch cơ bản.
- Có test cho các luồng quan trọng.
- Có thể deploy lên staging.
