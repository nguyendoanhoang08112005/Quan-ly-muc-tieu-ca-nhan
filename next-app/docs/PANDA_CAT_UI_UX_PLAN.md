# Panda Cat Rabbit UI UX Plan

## 1. Mục tiêu mới

Tài liệu này lấy `homepage hiện tại` làm chuẩn thị giác cho toàn bộ app.

Định hướng chung:

- trắng là nền chính
- layout phải rõ nhịp hơn màu sắc
- module thật của sản phẩm phải xuất hiện trong UI
- mascot chỉ làm accent
- mỗi màn phải trả lời ngay câu hỏi: `người dùng đang cần làm gì ở đây`

Homepage mới đã chốt một hướng rõ:

- `nav mảnh`
- `hero gói vào một khối lớn`
- `wall of features` thay cho mockup chung chung
- `4 ô trung tâm` đại diện cho sản phẩm thật
- `module icons` bao quanh để cho thấy hệ thống đầy đủ

Từ đây, các màn bên trong phải đi theo cùng logic đó.

## 2. Homepage là nguồn chuẩn

## 2.1. Những gì homepage đã chốt

Homepage hiện tại có 5 quyết định thiết kế quan trọng:

1. `Không có hero chữ riêng + mockup riêng`
2. `Khối lớn đầu trang vừa là hero vừa là preview`
3. `Nội dung trong khối preview phải là dữ liệu thật của sản phẩm`
4. `Các module xung quanh là icon nhỏ, đều, sạch, không tranh trọng tâm`
5. `Mascot chỉ treo quanh khối lớn như ornament`

Đây là rule phải giữ khi làm các trang trong app.

## 2.2. Cấu trúc chuẩn của một màn

Mỗi màn chính trong app nên có 3 lớp:

- `Lớp 1`: tiêu đề + hành động chính
- `Lớp 2`: khối preview/tổng quan lớn nhất của màn
- `Lớp 3`: module con hoặc danh sách thao tác

Không nên:

- nhồi quá nhiều card nhỏ ở phần đầu
- để phần đầu chỉ toàn text
- để data chính nằm quá thấp, bắt user phải cuộn mới hiểu màn

## 3. Hệ visual phải dùng

## 3.1. Nền

- `App background`: `#FFFFFF`
- `Surface chính`: trắng
- `Surface phụ`: trắng ngà rất nhẹ
- không dùng nền gradient phủ cả trang
- chỉ cho phép gradient/glow ở `hero`, `preview surface`, hoặc `block nhấn`

## 3.2. Màu

### Neutral

- `Ink`: `#1F1C1A`
- `Muted`: `#6B645D`
- `Soft line`: `#ECE7E1`
- `Warm wash`: `#FBFAF9`

### Accent theo module

- `Goals / Panda`: tím bamboo dịu + xanh lá nhạt
- `Tasks / Cat`: peach, coral rất nhẹ
- `Habits / Rabbit`: blush, mint, carrot nhẹ
- `Notes / Projects`: neutral là chính, accent rất ít

Rule:

- mỗi block chỉ có `1 accent chính`
- không để 3 accent cạnh nhau trong cùng một card
- trạng thái quan trọng hơn mascot

## 3.3. Bóng, bo góc, viền

- border mềm, mỏng
- bo góc lớn `18px - 30px`
- shadow mờ, thấp
- ưu tiên phân cấp bằng `spacing` trước, `shadow` sau

## 3.4. Typography

Tone chữ phải giống homepage:

- heading lớn, nặng, rất rõ
- body ngắn, line-height thoáng
- label viết ít chữ
- uppercase chỉ dùng cho badge nhỏ hoặc eyebrow

Rule:

- không dùng đoạn mô tả dài kiểu “giải thích giao diện”
- không nói về thiết kế trong UI
- chỉ nói về mục tiêu, việc, tiến độ, thói quen, quay lại

## 4. Vai trò của mascot

Mascot không còn là “nhân vật chính”.

## 4.1. Chỗ được phép dùng mascot

- ornament treo ở góc hero
- empty state
- success state
- toast nhỏ
- onboarding
- comeback moments

## 4.2. Chỗ không được dùng mascot

- giữa dashboard chính
- giữa board kanban
- trong form chính
- ở mọi card dữ liệu
- lặp lại 3 mascot trong cùng một khu vực

## 4.3. Mapping mascot

- `Gấu trúc`: goals, focus, pomodoro
- `Mèo`: tasks, quick add, board, drag-drop
- `Thỏ`: habits, comeback, restart

## 5. Quy tắc UX cần kéo từ homepage vào app

## 5.1. Hero phải là preview thật

Hero của các màn trong app không được chỉ là:

- tiêu đề
- mô tả
- vài stat card

Hero đúng phải có:

- tiêu đề ngắn
- CTA chính
- một preview cụ thể của màn đó

Ví dụ:

- `Dashboard`: preview “hôm nay”
- `Goals`: preview “mục tiêu tuần”
- `Tasks`: preview “wall of task states”
- `Habits`: preview “streak / comeback”

## 5.2. Card không được chỉ là box trắng

Mọi card chính cần có một trong các vai trò rõ:

- tóm tắt
- preview
- thao tác
- trạng thái

Nếu card không làm một trong 4 việc này thì bỏ.

## 5.3. Module thật phải xuất hiện

Homepage đã cho thấy:

- mục tiêu
- công việc
- thói quen
- ghi chú
- pomodoro
- dự án
- tags
- deadline
- nhắc việc
- lịch

Các màn trong app cũng phải dùng chính hệ module này, không bịa thêm ngôn ngữ mới.

## 6. Kế hoạch áp dụng cho từng trang

## 6.1. Dashboard

### Mục tiêu

Biến dashboard thành `mission control` của cả sản phẩm.

### Cấu trúc

- hero lớn như homepage, nhưng nội dung là `hôm nay`
- giữa hero là 4 ô chính:
  - mục tiêu đang chạy
  - việc đang focus
  - streak hiện tại
  - ghi chú/nguyên tắc hôm nay
- xung quanh là module chip nhỏ như homepage

### Bỏ

- stat card rời rạc không có preview thật
- quá nhiều copy giải thích
- mascot nằm giữa hero

## 6.2. Goals list

### Mục tiêu

Trang goals phải cho thấy:

- mục tiêu nào đang sống
- mỗi mục tiêu đang ở chặng nào
- có thể tạo nhanh ngay trên trang

### Cấu trúc

- hero kiểu `wall of goals`
- giữa là 3-4 mục tiêu đại diện
- xung quanh là chip module nhỏ: cột mốc, tiến độ, deadline, riêng tư, note
- danh sách goal card bên dưới phải nhẹ hơn hero

### Rule

- accent chỉ dùng bamboo/panda
- progress phải đọc được ngay
- form tạo mục tiêu không được dài hơn nội dung list

## 6.3. Goal detail

### Mục tiêu

Goal detail phải đọc như một hành trình, không như trang admin.

### Cấu trúc

- đầu trang: title + trạng thái + progress + CTA
- khối chính: `milestone wall`
- mỗi milestone là một block rõ
- task trong milestone là sub-layer, không tranh milestone

### Rule

- progress strip phải là phần dễ thấy nhất
- actions phụ phải gọn
- log/history phải đẩy xuống thấp

## 6.4. Tasks / board

### Mục tiêu

Board phải là màn nhanh nhất trong toàn app.

### Cấu trúc

- đầu trang: title + filter chính
- ngay dưới là `wall of task states`
- mỗi cột là một vùng làm việc
- quick add nằm đúng trong cột, không biến thành form admin

### Rule

- dùng accent mèo cho:
  - active chips
  - quick add
  - drag highlight
  - overdue/focus
- không dùng mascot lớn ở giữa board
- empty state được phép có mèo nhỏ

## 6.5. Habits

### Mục tiêu

Habits phải cho cảm giác quay lại nhẹ nhàng, không bị phán xét.

### Cấu trúc

- hero: streak + comeback + habit focus
- preview dạng lưới ngày hoặc vòng nhịp
- thỏ chỉ ở góc hoặc empty state

### Rule

- blush/mint/carrot chỉ dùng nhẹ
- không biến habits thành màn candy color

## 6.6. Notes

### Mục tiêu

Notes là nơi yên nhất.

### Cấu trúc

- hero rất gọn
- preview note list hoặc note canvas
- neutral nhiều hơn accent

### Rule

- không cần nhiều mascot
- không cần nhiều màu

## 6.7. Projects / Pomodoro / Categories / Tags

### Projects

- giống goals nhưng neutral hơn
- project overview là trọng tâm

### Pomodoro

- focus timer là hero
- gấu trúc chỉ đứng cạnh timer hoặc break state

### Categories / Tags

- utility pages
- phải cực gọn
- không cần cố “cute hóa”

## 7. Component system cần có

## 7.1. Hero wall

Component mới nên chuẩn hóa:

- `PageHeroWall`
- có `eyebrow`
- có `headline`
- có `supporting copy`
- có `primary CTA`
- có `preview surface`
- có `module chips`
- có `mascot ornaments`

## 7.2. Preview tiles

Cần 4 loại tile:

- `summary tile`
- `progress tile`
- `board tile`
- `note tile`

## 7.3. Module chip

Chip module phải:

- cùng height
- icon nhỏ
- text ngắn
- border mềm
- inactive là trắng
- active mới có accent

## 7.4. Mascot ornament

Chỉ là:

- badge nhỏ
- treo góc
- scale nhỏ
- không nhận focus chính

## 8. Copywriting rules

## 8.1. Homepage tone

Tone đúng là:

- rõ
- trưởng thành
- ngắn
- nói đúng tính năng

Không dùng:

- “lấy tinh thần từ…”
- “landing thật”
- “demo giao diện”
- các câu nói về thiết kế ngay trong UI

## 8.2. Inner pages tone

Nên dùng:

- “Mục tiêu đang chạy”
- “Việc trong ngày”
- “Theo dõi nhịp”
- “Quay lại nhẹ”

Không nên dùng:

- copy dài 2-3 dòng cho một card nhỏ
- mô tả thứ user đã nhìn thấy
- giải thích logic hệ thống quá sớm

## 9. Lộ trình làm tiếp

## Phase 1

- dashboard
- goals list
- goal detail

## Phase 2

- tasks page
- task board polish
- habits

## Phase 3

- notes
- projects
- pomodoro
- utility pages

## 10. Tiêu chí kiểm tra sau mỗi màn

Sau khi làm xong một màn, phải tự kiểm tra:

1. phần đầu màn có cho thấy `preview thật` không
2. màn này có nói đúng sản phẩm không
3. có còn card thừa hoặc đoạn text thừa không
4. mascot có đang lấn vai trò dữ liệu không
5. màu có đang vượt quá nhu cầu của màn không
6. user có biết hành động chính trong 3 giây đầu không

Nếu không qua 6 câu này thì màn đó chưa đạt.
