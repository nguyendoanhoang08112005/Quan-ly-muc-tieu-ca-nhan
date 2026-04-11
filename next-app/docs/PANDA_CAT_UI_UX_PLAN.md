# Panda Cat Rabbit UI UX Plan

## 1. Mục tiêu tổng thể

Biến sản phẩm từ một ứng dụng quản lý mục tiêu kiểu "dashboard nghiêm túc" thành một sản phẩm:

- vui hơn
- hóm hỉnh hơn
- có cá tính riêng
- vẫn gọn, rõ, dễ dùng hằng ngày

Tinh thần chính:

- `Gấu trúc` đại diện cho sự bình tĩnh, tập trung, làm việc sâu, nhịp chậm mà chắc
- `Mèo` đại diện cho sự lanh lợi, tinh nghịch, quick win, thao tác nhanh, nhắc nhẹ
- `Thỏ` đại diện cho sự khởi đầu mới, thói quen nhỏ, sự trở lại mềm mại sau những ngày hụt nhịp

Mục tiêu không phải làm giao diện thành "app cho trẻ em". Mục tiêu là tạo một hệ visual đáng yêu nhưng vẫn đủ trưởng thành để người dùng muốn mở lên mỗi ngày.

## 2. Tuyên ngôn thiết kế

### 2.1. Tính cách sản phẩm

Sản phẩm nên mang 5 cảm giác:

- `ấm`: nền sáng, chất liệu mềm, ít góc cạnh hung hăng
- `thú vị`: có mascot, microcopy, trạng thái vui mắt
- `nhẹ đầu`: form và dashboard không tạo áp lực thị giác
- `có nhịp`: mỗi màn có một điểm nhấn, không phải toàn card trắng giống nhau
- `có hy vọng`: kể cả khi người dùng trễ việc hay đứt streak, UI vẫn kéo họ quay lại nhẹ nhàng

### 2.2. Vai trò của 3 mascot

#### Gấu trúc

Dùng cho:

- màn cần tập trung
- goal planning
- progress overview
- deep work
- pomodoro
- trạng thái "đang đi đúng hướng"

Tính cách:

- điềm tĩnh
- đáng tin
- hơi lười một cách duyên
- làm ít nhưng ra việc

Ngôn ngữ hình ảnh:

- ngồi ôm tre
- nằm đọc checklist
- uống trà khi đang focus
- đeo kính khi vào màn sâu như dashboard, goal detail, pomodoro

#### Mèo

Dùng cho:

- quick add
- task board
- empty state
- notification
- success toast
- các màn cần năng lượng và nhắc nhẹ

Tính cách:

- lanh
- hơi nghịch
- tạo động lực kiểu trêu đùa
- linh hoạt, lướt nhanh

Ngôn ngữ hình ảnh:

- mèo vồ task
- mèo chồm lên chip filter
- mèo nằm trong hộp empty state
- mèo giơ chân báo "xong rồi"

#### Thỏ

Dùng cho:

- onboarding
- đăng ký
- habit streak
- first-use experience
- empty state mang tính khích lệ
- trạng thái "bắt đầu lại cũng được"

Tính cách:

- nhanh nhưng không áp lực
- trong trẻo
- tử tế
- kéo người dùng quay lại bằng cảm giác nhẹ nhàng

Ngôn ngữ hình ảnh:

- thỏ nhảy qua từng ô streak
- thỏ cầm cà rốt checklist
- thỏ ló đầu ở màn chào mừng
- thỏ kéo người dùng trở lại khi bỏ lỡ một ngày

## 3. Hệ visual chung

### 3.1. Bảng màu chính

#### Panda base

- `Panda Ink`: `#1F1B18`
- `Bamboo Mist`: `#DDE8D4`
- `Rice Cream`: `#F8F5EE`
- `Stone Milk`: `#EFEAE0`

#### Cat accent

- `Cat Peach`: `#F6C7B6`
- `Cat Coral`: `#EB8E73`
- `Whisker Pink`: `#FBE7E1`
- `Toy Yellow`: `#F7D87C`

#### Rabbit accent

- `Rabbit Milk`: `#FFF7FB`
- `Carrot Pop`: `#F29A52`
- `Blush Ear`: `#F5D7E7`
- `Meadow Mint`: `#DFF3E7`

#### Functional colors

- focus: amber vàng mềm
- in progress: xanh trời sáng
- completed: xanh lá bamboo
- paused: cam sữa
- comeback: hồng phấn pha đào, dùng cho streak và empty state khích lệ
- destructive: đỏ dâu nhạt, không đỏ gắt

### 3.2. Chất liệu

- nền không phẳng 100%, nên có gradient nhẹ như giấy, kem, trà sữa
- card bo lớn, bóng mềm, tránh kiểu admin panel góc cứng
- icon hoặc mascot có thể dùng như watermark rất nhẹ ở hero card
- border mềm màu stone thay vì xám đậm
- các module khác nhau dùng cùng chất liệu, chỉ đổi accent theo mascot chính

### 3.3. Hình khối

- ưu tiên bo tròn lớn: `20px - 32px`
- button dạng viên thuốc
- card chính như "khay", "bảng gỗ sáng" hoặc "tấm note mềm"
- badge nhỏ như nhãn dán
- chip filter có cảm giác như sticker sưu tầm

### 3.4. Typography

Hướng chữ:

- heading đậm, vui, có cá tính
- body text dễ đọc, không quá nghiêm
- label ngắn, giảm văn phong tài liệu

Đề xuất:

- heading: `Baloo 2`, `Nunito`, hoặc `Quicksand`
- body: `Be Vietnam Pro`, `Plus Jakarta Sans`, hoặc `Manrope`

Lưu ý:

- không dùng quá nhiều font
- heading vui, body phải gọn và ổn định
- tone chữ thay đổi bằng copy và spacing, không lạm dụng màu mè

### 3.5. Hệ nền và layer

Không đi theo kiểu:

- nền trắng
- card trắng
- input trắng
- button đen

Hướng đúng là nền nhiều lớp nhưng vẫn nhẹ mắt:

- `App background`: gradient kem sáng pha tre, đào và blush rất nhẹ
- `Surface level 1`: card chính dùng `Rice Cream` pha tint theo module
- `Surface level 2`: card con dùng nền nhạt hơn, có viền stone mềm
- `Surface level 3`: input, chip, mini panel dùng nền tinted glass nhẹ

Ví dụ:

- dashboard: nền `Rice Cream` pha `Bamboo Mist`
- tasks: nền kem pha `Whisker Pink` và `Toy Yellow` rất nhẹ
- habits: nền `Rabbit Milk` pha `Meadow Mint`
- goal detail: nền kem pha tre xanh nhạt

Rule:

- không dùng `#FFFFFF` làm nền chủ đạo cho cả màn
- chỉ dùng trắng gần thuần cho điểm highlight nhỏ hoặc content sheet bên trong
- mỗi màn phải có ít nhất một lớp nền hoặc glow giúp nhìn ra mood riêng

### 3.6. Button system

Button phải có thứ bậc thị giác và gắn mood mascot, không thể để tất cả trắng hoặc đen.

#### Primary CTA

Dùng cho hành động chính của màn:

- goals: gradient tre xanh đậm sang ink mềm
- tasks: coral pha đào hoặc ink đậm với viền ấm
- habits: carrot pop pha blush ear

Style:

- bo tròn lớn
- padding dày
- shadow mềm màu cùng tông
- hover nâng nhẹ, không scale lố

#### Secondary button

- nền tinted theo module
- viền stone rõ nhưng mềm
- text màu ink
- dùng cho `Xem thêm`, `Mở`, `Cập nhật`, `Quay lại`

#### Ghost / subtle

- không trong suốt hoàn toàn
- nên có nền sữa rất nhạt để tránh cảm giác text trôi
- dùng cho action phụ hoặc filter toolbar

#### Destructive

- không dùng đỏ gắt kiểu lỗi hệ thống
- dùng đỏ dâu hoặc hồng đỏ ấm
- chỉ lên full màu khi hover hoặc confirm state

### 3.7. Input, select, textarea, chip

Form controls phải có cảm giác "đang thao tác trên một công cụ được chăm chút", không phải HTML mặc định bọc card.

#### Input và select

- nền kem pha tint theo module
- border stone mềm, dày hơn mặc định một chút
- focus ring có màu mascot chính của màn
- placeholder dùng màu muted ấm, không xám lạnh

#### Textarea

- dùng như giấy note mềm
- chiều cao vừa đủ, không kéo dài vô nghĩa
- có thể có hint line hoặc corner glow nhẹ

#### Chip / filter

- inactive: nền sữa tinted
- active: full accent color hoặc accent + ink
- chip mèo: đào, vàng đồ chơi
- chip gấu trúc: tre xanh, ink
- chip thỏ: carrot, blush

#### Toggle / checkbox / radio

- checkbox ưu tiên nên có icon riêng như `paw`, `leaf`, `carrot seed`
- trạng thái on có animation rất ngắn, không giật

### 3.8. Card system

Card không được chỉ là "hộp trắng có shadow".

#### Hero card

- có gradient nội bộ
- có glow mascot nhẹ
- có khu vực highlight số liệu hoặc CTA

#### Data card

- nền cream tinted
- viền stone + inset highlight nhẹ
- số liệu to, text phụ ngắn

#### Form card

- nền ấm hơn background một nấc
- chia section rõ
- action footer có line phân tách nhẹ

#### Empty state card

- minh họa mascot nhỏ
- một câu rõ việc nên làm tiếp
- một CTA nổi bật

### 3.9. Mapping màu theo module

- `Dashboard / Goals / Pomodoro`: tre xanh + ink + cream
- `Tasks / Quick actions / Notifications`: đào, coral, vàng đồ chơi
- `Habits / Onboarding / Comeback`: carrot, blush, meadow mint
- `Notes`: pastel paper, hồng be, cream
- `Projects`: neutral ấm pha accent theo project

## 4. Nguyên tắc UX

### 4.1. Ít áp lực hơn

Người dùng mở app không nên thấy một bức tường form trắng. Mỗi màn cần có:

- một điểm nhìn chính
- một hành động chính
- một lớp thông tin phụ có thể thu gọn

### 4.2. Mascot là hướng dẫn, không phải đồ trang trí vô nghĩa

Ví dụ:

- empty state goals: mèo ngồi trên tờ note và nhắc tạo mục tiêu đầu tiên
- dashboard focus: gấu trúc ôm tre với dòng "Hôm nay làm ít nhưng trúng việc"
- overdue tasks: mèo cau mày, nhưng theo kiểu dễ thương chứ không dọa
- streak hụt: thỏ nghiêng đầu với dòng "Không sao, mình nhảy lại từ hôm nay"

### 4.3. Microcopy phải có duyên

Ví dụ nên dùng:

- "Mèo đang chờ việc mới."
- "Gấu trúc bảo việc này đáng ưu tiên."
- "Thỏ nói hôm nay bắt đầu lại vẫn tính là tiến lên."
- "Chưa có gì trong góc này. Có muốn thả một việc vào không?"

Không nên dùng:

- câu quá dài
- giọng quá kỹ thuật
- văn phong quá đáng yêu đến mức trẻ con

### 4.4. Trải nghiệm phải có phần thưởng

Khi người dùng:

- hoàn thành việc
- kéo thả đúng cột
- tạo mục tiêu đầu tiên
- streak habit tăng

thì giao diện nên có phản hồi vui:

- toast có mascot
- icon chuyển động nhẹ
- badge thành tựu nhỏ
- lời nhắc quay lại mềm khi người dùng hụt nhịp

## 5. Kế hoạch từ trang chủ đến dashboard

## 5.1. Trang chủ `(public)/page.tsx`

### Vai trò

Trang chủ phải bán được cảm giác:

- quản lý cuộc sống nhưng không khô
- đây là sản phẩm có cá tính
- app này làm việc nghiêm túc theo cách dễ thương

### Bố cục đề xuất

#### Hero

- bên trái: headline mạnh
- bên phải: minh họa gấu trúc, mèo và thỏ cùng đứng quanh một bảng kế hoạch

Nội dung:

- headline: "Làm việc có mục tiêu, nhưng đừng làm cuộc sống thành bảng tính."
- subheadline: "Một không gian quản lý mục tiêu, việc làm và thói quen với gấu trúc giữ nhịp, mèo kéo hành động, thỏ giữ động lực khởi đầu."
- CTA chính: `Bắt đầu cùng bộ ba`
- CTA phụ: `Xem không gian mẫu`

### Section tiếp theo

- `Goal planning` với gấu trúc
- `Task board` với mèo
- `Habit streak` với thỏ
- `Pomodoro` với gấu trúc uống trà

### Phong cách

- nền sáng ngà
- mảng màu tre xanh, cam cà rốt và hồng đào rất nhẹ
- có vài shape như paw print, lá tre, tai mèo, tai thỏ nhưng dùng tiết chế

### Màu và CTA

- hero background không trắng, mà là gradient `Rice Cream -> Bamboo Mist -> Rabbit Milk`
- CTA chính dùng gradient tre xanh pha ink, có icon nhỏ của bộ 3 mascot
- CTA phụ là secondary button nền sữa pha hồng đào
- các section phía dưới xen kẽ nền kem, blush, bamboo để tránh cảm giác landing page trắng kéo dài

## 5.2. Đăng nhập / đăng ký `(auth)/login`, `(auth)/register`

### Mục tiêu

Đỡ nhàm chán, đỡ "điền form xong thôi".

### Hướng thiết kế

- layout 2 cột trên desktop
- trái: form ngắn gọn
- phải: mascot illustration + lời nhắn ngắn

Ví dụ:

- login: mèo đang ngó vào màn hình "Lâu rồi mới gặp."
- register: thỏ cầm cà rốt checklist "Bắt đầu nhẹ thôi, mình nhảy từng bước."
- return user sau vài ngày vắng mặt: gấu trúc và thỏ cùng chào "Mình nối lại nhịp từ hôm nay."

### UX

- bỏ mô tả dài dòng
- lỗi form nên hiển thị ngắn gọn, thân thiện
- CTA rõ, không dùng nhiều text phụ

### Màu và form

- auth form card dùng nền kem pha blush hoặc bamboo tùy ngữ cảnh
- input không để trắng thuần, dùng nền sữa ấm
- submit button:
  - login: mèo, coral hoặc ink ấm
  - register: thỏ, carrot pop pha blush
- khu vực minh họa bên phải có gradient và mascot lớn hơn, không để trống

## 5.3. App shell, sidebar, mobile nav

### Sidebar

Nên biến sidebar thành một "góc trú" của sản phẩm:

- logo là đầu mèo hoặc đầu gấu trúc tối giản, có phiên bản đủ bộ 3 mascot cho brand page
- top area có mascot avatar luân phiên theo section
- navigation item active có shape như sticker, không phải chỉ là nền đen

### Màu và trạng thái

- sidebar không dùng nền trắng phẳng, mà là nền cream pha stone
- item active:
  - dashboard/goals: bamboo chip
  - tasks: peach-coral chip
  - habits: blush-carrot chip
- hover state là tint rất nhẹ, không phải đổ nền đen
- badge đếm nên là mini capsule đồng màu với module

### Mapping mascot theo module

- Dashboard: gấu trúc
- Làm việc / tasks: mèo
- Mục tiêu: gấu trúc
- Thói quen: thỏ
- Pomodoro: gấu trúc
- Ghi chú: mèo nằm lên giấy note
- Onboarding / getting started: thỏ

### Mobile nav

- icon bo tròn hơn
- active item có nền như jelly capsule
- có thể dùng paw dot cho notification, carrot dot cho streak, bamboo dot cho focus

## 5.4. Dashboard `(app)/dashboard/page.tsx`

### Mục tiêu

Dashboard phải giống "trạm điều khiển vui vẻ" thay vì một cụm thống kê vô hồn.

### Bố cục đề xuất

#### Hero card

- gấu trúc ngồi thư giãn
- câu chào theo thời điểm trong ngày
- tóm tắt: hôm nay có bao nhiêu việc focus, bao nhiêu việc quá hạn, streak habit

Ví dụ text:

- "Hôm nay gấu trúc khuyên bạn chốt 1 việc quan trọng trước."

#### 3 khối chính

- `Việc cần chú ý ngay`
- `Tiến độ mục tiêu`
- `Thói quen hôm nay`

#### Khối phụ

- quick add dạng mèo nhảy vào khay
- habit streak mini có thỏ
- pomodoro mini
- nhật ký gần đây

### UX

- không nhồi tất cả card cùng trọng số
- có một card hero lớn
- còn lại chia 2-3 cột rõ nhịp

### Màu và component

- hero card dùng gradient tre + cream, có glow xanh nhạt
- khối `Việc cần chú ý ngay` dùng accent mèo pha đào
- khối `Thói quen hôm nay` dùng accent thỏ pha carrot và meadow mint
- các stat card không đồng màu, nhưng phải cùng hệ chất liệu
- quick add trên dashboard không dùng white sheet, mà dùng composer coral-blush nhẹ

## 6. Kế hoạch các màn chính sau dashboard

## 6.1. Mục tiêu `(app)/goals/*`

### Goals list

- hero: gấu trúc ôm ống tre mục tiêu
- inline create panel: như tờ note dán, không phải form admin
- empty state: "Gấu trúc chưa có mục tiêu để canh giữ."

### Goal detail

- milestone là các "chặng tre"
- mỗi cột mốc như một trạm dừng trên đường đi
- task trong goal nên gọn hơn, ít card lồng nhau
- log timeline có icon mèo, gấu trúc hoặc thỏ nhỏ tùy loại event

### Màu và cấu trúc

- hero detail dùng nền tre xanh sáng pha kem, không phải card trắng lớn
- progress card dùng ink + bamboo glow
- milestone card dùng surface tinted xanh nhạt, task bên trong sáng hơn một nấc
- nút `Thêm cột mốc` là primary bamboo
- action nguy hiểm tách ra và dùng đỏ dâu ấm

### Goal edit

- card tổng quan bên phải
- form chính bên trái
- text ngắn, hướng dẫn theo kiểu coach mềm

## 6.2. Làm việc `(app)/tasks/page.tsx`

### Board concept

Board nên là sân chơi của mèo:

- cột có accent màu riêng
- khi kéo thả, cột sáng lên như hiện đang "mở miệng đón task"
- task card có quick action rất rõ
- filter nhanh là các chip như đồ chơi mèo

### Empty state

- "Mèo đang nằm chờ việc mới."
- "Cột này đang trống, thả một việc vào đây."

### Quick add

- cảm giác như "viết một mẩu giấy rồi thả vào cột"
- không giống mini admin form

### Màu và thao tác

- mỗi cột có accent riêng nhưng vẫn cùng hệ mèo
- composer thêm nhanh dùng nền peach/whisker tint, không phải white card
- due chip active dùng coral hoặc ink ấm
- card drag state sáng lên rõ bằng glow cùng màu cột
- quick action button trên card là pill có nền tint, không phải button trắng mặc định

## 6.3. Dự án `(app)/projects/*`

### Theme

Dự án là "ngôi nhà lớn", các task là đồ vật bên trong.

### Hướng UI

- project card có bìa màu nhẹ
- project detail có header như bảng ghim
- task gắn project có icon mèo cắp đồ, gấu trúc giữ nhịp hoặc thỏ báo tiến độ khởi đầu

## 6.4. Thói quen `(app)/habits/*`

### Theme

Thỏ phải là mascot chính của habit vì tạo cảm giác nhịp nhỏ mỗi ngày và tinh thần "hụt một hôm không sao".

### Ý tưởng

- streak dùng nhịp bước nhảy hoặc dấu chân thỏ thay vì dấu chân mèo
- habit completion tạo phản hồi như thỏ nhảy lên một nấc
- bad days dùng microcopy nhẹ nhàng, không tạo cảm giác thất bại

### Màu và phản hồi

- habits page dùng nền rabbit milk pha meadow mint
- streak card dùng carrot pop làm màu điểm nhưng không phủ toàn màn
- CTA check-in là nút carrot gradient
- missed day banner dùng blush nhẹ, tránh đỏ cảnh báo

Ví dụ:

- "Hôm nay thỏ chưa thấy bạn check-in."
- "Ổn rồi, mai nhảy tiếp."
- "Bỏ lỡ một ngày không làm đường chạy biến mất."

## 6.5. Ghi chú `(app)/notes/*`

### Theme

Mèo nằm trên giấy note hoặc đẩy bút.

### Hướng UI

- note card như sticky note mềm
- màu nhạt pastel
- edit view giống sổ tay hơn là form CRUD

## 6.6. Pomodoro `(app)/pomodoro/page.tsx`

### Theme

Đây là màn rất hợp cho gấu trúc.

### Hướng UI

- timer trung tâm lớn
- gấu trúc uống trà hoặc ngồi thiền
- chế độ focus và break có 2 mood khác nhau

Ví dụ:

- focus: gấu trúc ngồi nghiêm túc
- break: mèo lăn ra chơi
- comeback sau break dài: thỏ nhắc quay lại bằng microcopy ngắn

## 6.7. Notifications, follows, settings

### Notifications

- icon chuông đi cùng biểu cảm mèo
- phân loại thông báo bằng sticker nhỏ

### Follows

- như "vườn mục tiêu" có nhiều mục tiêu theo dõi
- mascot nhẹ hơn, không tranh với nội dung

### Settings profile

- tối giản hơn các màn khác
- có góc chọn `mood mascot`: panda, cat, rabbit, mixed
- có thể chọn `độ tinh nghịch của microcopy`: nhẹ, vừa, rõ ràng tối giản

## 7. Component system cần làm

## 7.1. Mascot assets

Cần chuẩn bị:

- panda hero
- panda focus
- panda success
- cat quick-add
- cat empty state
- cat warning nhẹ
- rabbit onboarding
- rabbit streak
- rabbit comeback
- sticker icon nhỏ: paw, bamboo, fish, yarn ball, bell, carrot, hop trail

Ưu tiên:

- SVG đơn giản
- cùng một style illustration
- ít màu, dễ tái dùng

## 7.2. New UI components

- `MascotHeroCard`
- `MoodEmptyState`
- `PawBadge`
- `BambooStatCard`
- `CuteQuickComposer`
- `MascotToast`
- `MoodSectionHeader`
- `StickerChip`
- `RabbitStreakCard`
- `ComebackBanner`
- `TintedInput`
- `MascotPrimaryButton`
- `ModuleSurfaceCard`
- `GradientActionBar`

## 7.3. Design tokens nên chốt

- `--bg-app`
- `--bg-surface-1`
- `--bg-surface-2`
- `--bg-muted`
- `--border-soft`
- `--shadow-soft`
- `--shadow-glow`
- `--accent-panda`
- `--accent-cat`
- `--accent-rabbit`
- `--accent-danger`
- `--text-strong`
- `--text-soft`

## 7.4. Motion

Motion nên nhẹ và hữu ích:

- mascot nháy mắt hoặc lắc nhẹ khi load
- task drop có pulse nhẹ
- complete action có sparkle rất ngắn
- streak tăng có hop animation rất nhanh của thỏ
- không dùng animation quá dài hoặc quá nhiều

## 8. Copywriting system

## 8.1. Giọng điệu

- ngắn
- hóm hỉnh
- không nói quá nhiều
- không "cute hóa" mọi thứ

### Công thức microcopy

- một phần hữu ích
- một phần dí dỏm

Ví dụ:

- "Chưa có việc nào ở đây. Mèo đang chiếm chỗ."
- "Mục tiêu này đang ngủ đông. Có muốn đánh thức nó không?"
- "Hôm nay tiến độ hơi chậm, nhưng gấu trúc vẫn tin bạn."
- "Không sao, thỏ giữ sẵn chỗ để bạn quay lại."

## 8.2. Success states

- "Xong rồi. Mèo duyệt."
- "Đã lưu. Gấu trúc ghi nhận."
- "Thả việc thành công."
- "Streak vẫn sống. Thỏ vừa nhảy thêm một ô."

## 8.3. Error states

- vẫn rõ nguyên nhân
- chỉ thêm một chút duyên, không làm mơ hồ

Ví dụ:

- "Tên công việc còn thiếu."
- "Hạn công việc chưa hợp lệ."
- "Mèo tìm mãi chưa thấy dữ liệu này."
- "Thỏ chưa thấy lịch hợp lệ để nhảy tới."

## 9. Nguyên tắc tránh bị sến hoặc rối

- mascot không xuất hiện ở mọi ngóc ngách
- một màn chỉ nên có một điểm nhấn mascot chính
- không dùng quá nhiều icon động vật cùng lúc
- không biến mọi button thành hình tai mèo
- ưu tiên usability trước trang trí

Rule quan trọng:

- `70% clean product UI`
- `20% mascot personality`
- `10% surprise delight`

## 10. Kế hoạch triển khai theo giai đoạn

## Phase 1. Foundation

- chốt palette panda + cat + rabbit
- chốt typography
- chốt bộ bo góc, shadow, chip, button
- chốt style illustration

## Phase 2. Public and shell

- homepage
- login/register
- onboarding
- sidebar
- mobile nav

## Phase 3. Core productivity

- dashboard
- goals
- tasks board
- task edit/create

## Phase 4. Secondary modules

- projects
- habits
- notes
- pomodoro

## Phase 5. Delight layer

- mascot toast
- empty state riêng theo page
- comeback banner cho streak hoặc overdue recovery
- seasonal theme nhẹ
- achievements và streak celebration

## 11. Ưu tiên thực thi nếu làm ngay trong codebase này

Thứ tự nên làm:

1. `globals.css`
2. app shell: sidebar + mobile nav
3. homepage `(public)/page.tsx`
4. dashboard
5. goals
6. tasks board
7. task edit/create
8. habits

Lý do:

- những chỗ này quyết định cảm nhận thương hiệu nhanh nhất
- sửa ít nhưng nhìn ra phong cách rõ ngay
- thỏ chỉ thực sự phát huy nếu habits và onboarding được làm đúng

## 12. Deliverables nên có

- bộ token màu
- bộ mascot SVG
- 1 file copy guideline
- 1 file component guideline
- 1 file mascot behavior guideline
- 1 file `design-tokens.md` cho màu, button, input, card, chip
- 1 file `page-mood-map.md` để map module nào dùng mascot và accent nào
- mockup cho:
  - homepage
  - dashboard
  - goals list
  - task board
  - task edit
  - habits

## 13. Kết luận

Hướng `gấu trúc + mèo + thỏ` hợp với sản phẩm này hơn mô hình 2 mascot, vì mỗi con vật gánh một nhóm cảm xúc và hành vi rõ ràng.

Gấu trúc cho phần:

- mục tiêu
- tiến độ
- focus
- pomodoro

Mèo cho phần:

- task board
- quick add
- empty state
- notification

Thỏ cho phần:

- onboarding
- habits
- first-use
- comeback moments

Nếu triển khai đúng, sản phẩm sẽ:

- khác biệt hơn
- vui hơn
- giữ người dùng tốt hơn
- bớt cảm giác "app quản lý công việc khô và nặng đầu"

Điểm mấu chốt là:

- mascot phải phục vụ UX
- sự hóm hỉnh phải đi cùng tính rõ ràng
- đáng yêu nhưng không làm mất tính chuyên nghiệp
