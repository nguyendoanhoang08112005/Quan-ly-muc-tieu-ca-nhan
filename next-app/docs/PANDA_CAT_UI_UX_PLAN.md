# Panda Cat Rabbit UI UX Plan

## 1. Mục tiêu tổng thể

Biến sản phẩm từ một ứng dụng quản lý mục tiêu khô và nặng thành một sản phẩm:

- gọn hơn
- sáng hơn
- thú vị hơn
- vẫn đủ trưởng thành để dùng mỗi ngày

Hướng mới của toàn bộ UI:

- `white-first UI`
- nền trắng là mặc định
- màu chỉ dùng để nhấn
- mascot chỉ dùng để tạo trải nghiệm, không dùng để phủ giao diện

## 2. Tinh thần sản phẩm

### 2.1. 5 cảm giác chính

- `sạch`: nhìn vào là thấy thoáng
- `nhẹ`: không có cảm giác bức tường card và form
- `ấm`: không lạnh như admin panel
- `vui vừa đủ`: có duyên nhưng không sến
- `có hy vọng`: lỗi, hụt nhịp, overdue đều được kéo lại nhẹ nhàng

### 2.2. Vai trò của 3 mascot

#### Gấu trúc

Dùng cho:

- mục tiêu
- tiến độ
- focus
- pomodoro
- deep work

Vai trò:

- bình tĩnh
- đáng tin
- giữ nhịp

#### Mèo

Dùng cho:

- task board
- quick add
- empty state
- notification
- success state

Vai trò:

- lanh
- nhanh
- tạo động lực nhẹ

#### Thỏ

Dùng cho:

- onboarding
- habits
- comeback state
- first-use experience

Vai trò:

- khởi đầu lại
- kéo người dùng quay lại
- giảm cảm giác bị phán xét

## 3. Hệ visual chung

### 3.1. Nguyên tắc nền

Nền tổng thể nên:

- là trắng hoặc trắng ngà
- không phủ gradient màu lớn lên cả màn
- chỉ dùng glow nhẹ ở hero hoặc block nhấn

Rule:

- `#FFFFFF` được phép là nền chính
- card chính vẫn có thể là trắng
- sự khác biệt đến từ spacing, hierarchy, border, shadow, accent, mascot

### 3.2. Bảng màu

#### Foundation

- `Paper White`: `#FFFFFF`
- `Warm White`: `#FCFAF7`
- `Soft Stone`: `#E9E1D7`
- `Stone Line`: `#DCCFC2`
- `Muted Text`: `#7C746D`
- `Ink`: `#1F1B18`

#### Panda accent

- `Bamboo Mist`: `#DDE8D4`
- `Bamboo Soft`: `#EDF5E8`
- `Leaf Deep`: `#7FA865`

#### Cat accent

- `Cat Peach`: `#F6C7B6`
- `Cat Coral`: `#EB8E73`
- `Whisker Pink`: `#FBE7E1`
- `Toy Yellow`: `#F7D87C`

#### Rabbit accent

- `Rabbit Milk`: `#FFF7FB`
- `Blush Ear`: `#F5D7E7`
- `Carrot Pop`: `#F29A52`
- `Meadow Mint`: `#DFF3E7`

#### Functional colors

- focus: vàng ấm
- in progress: xanh dương nhạt
- completed: xanh lá nhạt
- paused: vàng kem
- comeback: hồng rất nhạt
- destructive: đỏ dâu ấm

### 3.3. Chất liệu

- card trắng, viền stone mềm
- shadow mờ, thấp, không nặng
- bo góc lớn `20px - 32px`
- input trắng, border mềm
- button đa số trắng hoặc ink
- mascot chỉ là accent, không phải background texture

### 3.4. Typography

Định hướng:

- heading vui nhưng không trẻ con
- body trung tính, dễ đọc lâu
- label ngắn

Đề xuất:

- heading: `Baloo 2` hoặc `Nunito`
- body: `Plus Jakarta Sans`, `Be Vietnam Pro`, hoặc `Manrope`

### 3.5. Layer system

- `App background`: trắng
- `Surface 1`: card trắng
- `Surface 2`: card con trắng pha stone rất nhẹ
- `Surface 3`: input/chip/button trắng hoặc warm white

Khi cần tạo mood:

- chỉ tint một góc
- chỉ tint một block
- không tint toàn trang

### 3.6. Button system

#### Primary

- mặc định dùng `Ink`
- một số màn có thể dùng accent, nhưng chỉ một màu
- không lạm dụng gradient

#### Secondary

- nền trắng
- viền stone
- text ink

#### Ghost

- gần như trắng trong
- active mới có accent

#### Destructive

- đỏ dâu ấm
- không đỏ chói

### 3.7. Form controls

#### Input / select

- nền trắng
- border stone mềm
- focus ring nhẹ
- placeholder muted ấm

#### Textarea

- trắng hoặc warm white
- không cần hiệu ứng trang trí nếu không giúp đọc

#### Chip / filter

- inactive: trắng, viền stone
- active: dùng accent
- trong một hàng filter chỉ nên có vài điểm màu

### 3.8. Card system

#### Hero card

- nền trắng
- có thể có glow nhẹ ở một góc
- có 1 khu vực nhấn

#### Data card

- nền trắng
- số liệu to
- text phụ ngắn

#### Form card

- nền trắng
- chia section rõ
- footer action tách nhẹ

#### Empty state card

- có mascot nhỏ
- một câu hướng dẫn
- một CTA

### 3.9. Mapping theo module

- `Dashboard / Goals / Pomodoro`: trắng + bamboo accent
- `Tasks / Quick actions / Notifications`: trắng + cat peach/coral accent
- `Habits / Onboarding / Comeback`: trắng + blush/carrot accent
- `Notes`: trắng + stone ấm
- `Projects`: trắng + neutral accent

## 4. Nguyên tắc UX

### 4.1. Một màn chỉ có một trọng tâm

Mỗi màn cần có:

- một điểm nhìn chính
- một hành động chính
- một lớp thông tin phụ

### 4.2. Mascot phải phục vụ UX

Mascot chỉ nên xuất hiện ở:

- hero nhỏ
- empty state
- success state
- reminder nhẹ
- onboarding
- ornament treo góc

Không nên:

- nhét 3 mascot vào giữa cùng một block
- để mascot tranh chỗ với form hoặc dữ liệu
- dùng mascot ở mọi card

### 4.3. Microcopy phải ngắn

Nên dùng:

- "Mèo đang chờ việc mới."
- "Gấu trúc bảo việc này đáng ưu tiên."
- "Thỏ nói hôm nay quay lại vẫn tính là tiến lên."

Không nên:

- giải thích dài
- mô tả một thứ ai cũng nhìn ra
- cute hóa quá đà

### 4.4. Phản hồi phải vui nhưng nhanh

Khi người dùng:

- hoàn thành việc
- kéo thả đúng cột
- tạo mục tiêu đầu tiên
- tăng streak

thì UI nên phản hồi bằng:

- toast ngắn
- icon chuyển động nhẹ
- mascot nhỏ
- badge gọn

## 5. Định hướng từ trang chủ đến dashboard

## 5.1. Trang chủ `(public)/page.tsx`

### Mục tiêu

Trang chủ phải cho thấy:

- sản phẩm này sạch
- có cá tính
- không quá màu mè

### Hướng giao diện

- nền trắng
- hero card trắng lớn
- mascot ở dạng minh họa hoặc ornament nhỏ
- CTA chính rõ, CTA phụ trắng

### Rule

- không phủ màu toàn hero
- màu chỉ ở CTA, badge, icon, mascot

## 5.2. Đăng nhập / đăng ký `(auth)/login`, `(auth)/register`

### Mục tiêu

- gọn
- bớt nhàm
- không giống form hệ thống mặc định

### Hướng thiết kế

- layout rõ
- form card trắng
- mascot là điểm nhấn duy nhất
- với login có thể dùng mèo peekaboo

### Rule

- input trắng
- button đa số trắng hoặc ink
- chỉ mascot mới mang cảm giác vui

## 5.3. App shell, sidebar, mobile nav

### Sidebar

- nền trắng hoặc stone rất nhạt
- item active dùng accent nhỏ
- icon rõ, text ngắn

### Mapping mascot

- Dashboard: gấu trúc
- Tasks: mèo
- Goals: gấu trúc
- Habits: thỏ

## 5.4. Dashboard `(app)/dashboard/page.tsx`

### Mục tiêu

Dashboard phải là một trạm điều khiển sạch:

- nhìn nhanh
- hiểu nhanh
- có cá tính vừa đủ

### Bố cục

- hero trắng lớn
- 3 stat card trắng
- một mascot chính hoặc ornament ở góc
- phần việc quan trọng nổi bật hơn phần còn lại

### Rule

- không nhồi mascot vào giữa hero
- mascot nên treo góc hoặc đứng cạnh một block
- text hero ngắn

## 6. Kế hoạch các màn chính sau dashboard

## 6.1. Mục tiêu `(app)/goals/*`

### Goals list

- hero trắng
- accent bamboo
- gấu trúc là mascot chính

### Goal detail

- progress card dùng bamboo accent nhỏ
- milestone card trắng
- log dùng icon nhỏ

### Goal edit

- form trắng
- summary card trắng
- copy ngắn

## 6.2. Làm việc `(app)/tasks/page.tsx`

### Board concept

Board là sân của mèo, nhưng chỉ theo cách tiết chế:

- board tổng vẫn trắng
- accent mèo chỉ ở chip, quick add, drop state, reminder
- cột không đổ màu mạnh

### Empty state

- "Mèo đang nằm chờ việc mới."
- "Cột này đang trống, thả một việc vào đây."

### Quick add

- giống một composer sạch
- không giống mini admin form
- nền trắng, accent chỉ ở các chip active

## 6.3. Dự án `(app)/projects/*`

- trắng là nền chính
- accent theo project
- mascot rất nhẹ

## 6.4. Thói quen `(app)/habits/*`

- trắng là nền chính
- thỏ là mascot chính
- streak là nơi dùng carrot/blush

## 6.5. Ghi chú `(app)/notes/*`

- trắng + stone ấm
- mèo chỉ nên là accent nhỏ

## 6.6. Pomodoro `(app)/pomodoro/page.tsx`

- trắng + bamboo
- gấu trúc là mascot chính
- focus và break khác nhau bằng trạng thái, không cần đổ màu cả màn

## 7. Component system cần làm

## 7.1. Mascot assets

Cần chuẩn bị:

- panda hero
- panda focus
- cat quick-add
- cat success
- rabbit onboarding
- rabbit streak
- rabbit comeback

Ưu tiên:

- SVG hoặc PNG rõ ràng
- cùng một style
- dùng như accent, không dùng như background

## 7.2. New UI components

- `MascotOrnament`
- `MoodEmptyState`
- `StickerChip`
- `CuteQuickComposer`
- `MascotToast`
- `ModuleSurfaceCard`
- `TintedActiveChip`

## 7.3. Design tokens

- `--bg-app`
- `--bg-surface-1`
- `--bg-surface-2`
- `--border-soft`
- `--shadow-soft`
- `--accent-panda`
- `--accent-cat`
- `--accent-rabbit`
- `--text-strong`
- `--text-soft`

## 7.4. Motion

- ornament mascot đung đưa rất nhẹ
- task drop có pulse nhẹ
- complete action có sparkle rất ngắn
- streak tăng có hop animation nhanh
- không dùng animation dài

## 8. Copywriting system

### Giọng điệu

- ngắn
- hóm hỉnh
- không lạm dụng thú vật trong mọi câu

### Ví dụ

- "Chưa có việc nào ở đây. Mèo đang chiếm chỗ."
- "Mục tiêu này đang ngủ đông."
- "Hôm nay tiến độ hơi chậm, nhưng gấu trúc vẫn canh."
- "Không sao, thỏ giữ sẵn chỗ để bạn quay lại."

### Error states

- phải rõ nguyên nhân trước
- duyên chỉ là phần phụ

## 9. Nguyên tắc tránh bị sến hoặc rối

- nền trắng là mặc định
- màu không phủ cả màn nếu không có lý do rõ ràng
- mascot không xuất hiện ở mọi ngóc ngách
- một màn chỉ nên có một mascot chính
- nếu có mascot phụ, chỉ nên ở mức ornament góc
- ưu tiên usability trước trang trí

Rule quan trọng:

- `85% clean product UI`
- `10% mascot personality`
- `5% surprise delight`

## 10. Kế hoạch triển khai

## Phase 1. Foundation

- chốt token trắng + accent
- chốt typography
- chốt border, radius, shadow, button

## Phase 2. Public and shell

- homepage
- login/register
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
- ornament góc
- comeback banner
- celebration nhỏ

## 11. Thứ tự nên làm ngay trong codebase này

1. `globals.css`
2. app shell
3. homepage
4. dashboard
5. goals
6. tasks board
7. task edit/create
8. habits

## 12. Kết luận

Hướng đúng cho sản phẩm này không phải là phủ màu hay nhét mascot khắp nơi.

Hướng đúng là:

- nền trắng để dễ dùng lâu
- accent màu để phân vai
- mascot để tạo cảm xúc đúng lúc

Điểm mấu chốt:

- mascot phải phục vụ UX
- trắng là nền để mọi thứ còn thở
- hóm hỉnh phải đi cùng rõ ràng
