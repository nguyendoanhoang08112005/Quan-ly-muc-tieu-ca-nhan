# Landing Page Improvement Plan

## 1. Phạm vi

Tài liệu này tập trung vào landing page công khai tại:

- `next-app/src/app/(public)/page.tsx`

Mục tiêu là biến trang hiện tại từ một bản trình bày "đẹp và có hướng" thành một landing page:

- rõ giá trị sản phẩm
- nhất quán ngôn ngữ
- ít lỗi UX cơ bản
- sẵn sàng dùng làm trang public thật
- đồng bộ hơn với ngôn ngữ visual của phần app bên trong

## 2. Đánh giá nhanh hiện trạng

### 2.1. Điểm mạnh

- Hero đã có trọng tâm rõ hơn bản dashboard trá hình.
- Mockup trung tâm có ý đồ và cho thấy sản phẩm cụ thể hơn kiểu landing chỉ toàn chữ.
- Mascot đang được dùng như accent, không còn chiếm toàn bộ bố cục.
- Bố cục nhìn chung sạch, có nhịp, khoảng trắng ổn.

### 2.2. Điểm yếu chính

- Điều hướng chưa hoàn thiện.
- Copy còn pha giọng nội bộ/dev.
- Ngôn ngữ Việt/Anh bị lẫn.
- Một số section lặp ý với nhau.
- Màu sắc landing chưa ăn khớp hoàn toàn với phần app thực tế.
- Cấu trúc file đang ôm quá nhiều phần, khó bảo trì.

## 3. Mục tiêu sau khi cải tiến

Landing page sau khi chỉnh nên trả lời nhanh 4 câu hỏi:

1. Sản phẩm này giúp gì cho tôi?
2. Nó hoạt động theo cách nào?
3. Nó khác gì so với một trang giới thiệu chung chung?
4. Tôi nên bấm vào đâu tiếp theo?

Nếu người dùng vào trang trong 5-8 giây, họ phải hiểu:

- app này dùng để quản lý mục tiêu và việc mỗi ngày
- app này gom mục tiêu, milestone, task, nhịp tập trung vào một luồng gọn
- có thể bắt đầu bằng `Tạo tài khoản` hoặc `Đăng nhập`

## 4. Các vấn đề cần sửa

## 4.1. P0 - Phải sửa ngay

### A. Link điều hướng `#mockup` đang chết

Hiện trạng:

- Header có link `Mockup`
- Page không có section nào mang `id="mockup"`

Tác động:

- Click không đi đâu
- Tạo cảm giác page chưa hoàn thiện

Cách sửa:

- Cách 1: đổi `href="#mockup"` thành `href="#tong-quan"`
- Cách 2: thêm `id="mockup"` cho block preview trung tâm

Khuyến nghị:

- Giữ link `Mockup` nếu thực sự muốn người dùng nhảy đến phần preview
- Nếu không, đổi menu thành `Tổng quan`, `Tính năng`, `Bắt đầu`

### B. CTA `Contact` đang dẫn sang `/login`

Hiện trạng:

- Nút ghi là `Contact`
- Link thực tế trỏ đến `/login`

Tác động:

- Sai kỳ vọng
- Giảm độ tin cậy

Cách sửa:

- Nếu chưa có trang liên hệ: bỏ nút này
- Nếu cần một CTA phụ: đổi thành `Đăng nhập`
- Nếu cần giữ contact: tạo route thật hoặc mailto thật

Khuyến nghị:

- Trên landing page này chỉ cần 2 CTA rõ:
- `Đăng nhập`
- `Tạo tài khoản`

### C. Copy mang giọng nội bộ/dev

Hiện trạng:

- Metadata nhắc đến `theo hướng Figma`
- Section cuối nói `không còn chỉ là đổi màu của bản cũ`
- Copy có ý "nếu hướng này đúng thì sẽ kéo tiếp"

Tác động:

- Người dùng không cần biết quy trình thiết kế nội bộ
- Làm trang giống bản draft hơn là bản public

Cách sửa:

- Viết lại toàn bộ copy theo lợi ích người dùng
- Không nhắc Figma, bản cũ, hướng mới, nội bộ team

Khuyến nghị:

- Mọi đoạn text public phải nói về:
- mục tiêu
- công việc
- tiến độ
- tập trung
- nhịp dùng hằng ngày

## 4.2. P1 - Nên sửa trong cùng đợt

### D. Ngôn ngữ đang bị lẫn Việt/Anh

Hiện trạng:

- `Task board`
- `Dashboard`
- `Contact`
- `Login`
- `Sign Up`
- `Modules`

Tác động:

- Gãy tone nội dung
- Trông như bản chưa chốt copy

Cách sửa:

- Thống nhất tiếng Việt toàn trang

Đề xuất mapping:

- `Dashboard` -> `Vào ứng dụng`
- `Task board` -> `Bảng việc`
- `Modules` -> `Tính năng`
- `Login` -> `Đăng nhập`
- `Sign Up` -> `Tạo tài khoản`
- `Contact` -> bỏ hoặc thay CTA thật

Lưu ý:

- `Pomodoro` có thể giữ nguyên nếu muốn dùng thuật ngữ phổ biến
- Nếu muốn thuần Việt hơn, đổi thành `Phiên tập trung`

### E. Lặp ý giữa khối preview và section `Modules`

Hiện trạng:

- Khối preview đã có feature wall hai bên
- Section `Modules` lại tiếp tục giới thiệu cùng ý

Tác động:

- Nội dung bị loãng
- Page dài hơn nhưng không tăng thêm hiểu biết

Cách sửa:

- Chọn một lớp giới thiệu tính năng làm trọng tâm

Phương án 1:

- Giữ khối preview với icon hai bên
- Bỏ section `Modules`

Phương án 2:

- Giảm icon hai bên mockup
- Giữ section `Tính năng chính` với 3 card rõ lợi ích

Khuyến nghị:

- Chọn phương án 2 nếu muốn page cân bằng giữa trực quan và nội dung

### F. Section cuối chưa làm tốt vai trò CTA cuối trang

Hiện trạng:

- Section cuối đang nói về quá trình thiết kế
- Không đóng vai trò kết thúc luồng chuyển đổi

Tác động:

- Mất momentum
- CTA cuối trang không đủ thuyết phục

Cách sửa:

- Thay toàn bộ bằng một section kiểu:
- `Cách app vận hành`
- hoặc `Vì sao giao diện này gọn`
- hoặc `Bắt đầu trong 3 bước`

Khuyến nghị:

- Dùng `3 bước bắt đầu`:
- `Tạo mục tiêu`
- `Chia thành cột mốc`
- `Kéo việc và giữ nhịp mỗi ngày`

CTA cuối:

- `Tạo tài khoản`
- `Đăng nhập`

## 4.3. P2 - Nâng chất lượng

### G. Landing page chưa thật sự đồng bộ với phần app

Hiện trạng:

- Landing dùng accent tím/hồng khá rõ
- Dashboard và app bên trong thiên về neutral ấm, wash nhẹ

Tác động:

- Chuyển cảnh từ landing sang app bị chênh
- Brand chưa liền mạch

Cách sửa:

- Giữ điểm nhấn tím/hồng ở mức ít hơn
- Dùng neutral ấm làm nền chính
- Để accent xuất hiện ở chip, badge, icon, progress, CTA phụ

Khuyến nghị:

- Cho landing gần hơn với hệ visual trong dashboard
- Không cần biến landing thành bản sao dashboard
- Chỉ cần cùng "họ" màu, viền, bóng, bo góc

### H. Một số stat trên hero là dữ liệu giả

Hiện trạng:

- `3 chặng`
- `1 việc focus`
- `6 ngày streak`

Tác động:

- Nếu user tưởng đây là số thật thì dễ hiểu nhầm
- Nếu nhìn kỹ sẽ thấy giống mock data

Cách sửa:

- Nếu là preview tĩnh: gắn nhãn `Ví dụ giao diện`
- Nếu user đã đăng nhập: cân nhắc dùng số thật từ session/dashboard

Khuyến nghị:

- Với visitor chưa đăng nhập: dùng lợi ích thay vì số
- Với user đã đăng nhập: có thể cá nhân hóa bằng dữ liệu thật

### I. Accessibility và keyboard states chưa đủ tốt

Hiện trạng:

- Nhiều `Link` tự style nhưng chưa có `focus-visible` rõ ràng
- Phần decor chưa phân tách rõ với nội dung chính

Tác động:

- Trải nghiệm keyboard yếu
- Accessibility chưa đạt mức tốt

Cách sửa:

- Thêm trạng thái focus nhất quán cho link và CTA
- Đánh dấu icon/ornament thuần trang trí là `aria-hidden`
- Kiểm tra contrast các text xám nhạt

## 5. Đề xuất cấu trúc landing page mới

Landing page nên có 5 khối theo đúng thứ tự dưới đây:

1. Header mảnh, sạch
2. Hero + preview trong cùng một khối
3. Tính năng chính
4. Cách app vận hành
5. CTA cuối trang

## 5.1. Header

Mục tiêu:

- cho người dùng biết brand
- có điều hướng ngắn
- có CTA rõ

Đề xuất:

- Logo + tên app
- Menu: `Tổng quan`, `Tính năng`, `Bắt đầu`
- CTA phải: `Đăng nhập`, `Tạo tài khoản`

Không nên:

- thêm `Contact` giả
- thêm quá nhiều item menu
- nhét icon hoặc chip không cần thiết

## 5.2. Hero

Mục tiêu:

- nói rõ giá trị lớn nhất của app
- cho thấy đây là tool để sử dụng mỗi ngày
- dẫn người dùng vào CTA chính

Đề xuất headline:

- `Biến mục tiêu lớn thành việc làm mỗi ngày.`

Đề xuất subcopy:

- `Tạo mục tiêu, chia cột mốc, kéo việc theo trạng thái và giữ nhịp tập trung trong một giao diện gọn, dễ quay lại mỗi ngày.`

CTA:

- chính: `Tạo tài khoản`
- phụ: `Xem cách hoạt động`

Nếu user đã đăng nhập:

- chính: `Vào ứng dụng`
- phụ: `Đăng xuất`

Không nên:

- headline quá chung như "mọi thứ bạn cần"
- CTA phụ quá mờ hoặc không dẫn đến section hữu ích

## 5.3. Preview trung tâm

Mục tiêu:

- chứng minh sản phẩm thay vì chỉ mô tả

Nội dung nên ưu tiên:

- `Mục tiêu đang làm`
- `Việc ưu tiên hôm nay`
- `Nhịp tập trung / thói quen`

Khuyến nghị:

- Chỉ giữ 3 khối thật mạnh thay vì 4-5 khối ngang sức nhau
- Có nhãn nhỏ kiểu `Ví dụ giao diện hôm nay`
- Stats phía dưới chỉ giữ nếu bổ sung ý mới

Không nên:

- lặp cùng nội dung vừa có trong preview vừa có ngay phía dưới
- thêm quá nhiều ô nhỏ làm preview giống dashboard mini

## 5.4. Tính năng chính

Mục tiêu:

- gom lại những giá trị cốt lõi thành 3 card ngắn, rõ

Đề xuất 3 card:

- `Mục tiêu rõ`
- `Bảng việc gọn`
- `Giữ nhịp hằng ngày`

Mỗi card nên trả lời:

- tính năng là gì
- người dùng được lợi gì

Định dạng copy:

- title ngắn
- mô tả 1 câu
- tránh jargon

## 5.5. Cách app vận hành

Mục tiêu:

- thay section nội bộ hiện tại bằng phần giải thích luồng sử dụng

Đề xuất:

### Bước 1

- `Tạo mục tiêu`
- Xác định việc lớn bạn muốn hoàn thành

### Bước 2

- `Chia thành cột mốc`
- Bẻ nhỏ thành các chặng dễ theo dõi

### Bước 3

- `Kéo việc và giữ nhịp`
- Làm việc theo trạng thái, quay lại app mỗi ngày

Phần này nên dùng:

- 3 card hoặc 3 hàng
- icon nhẹ
- CTA cuối rõ ràng

## 6. Hệ copy đề xuất

## 6.1. Tone of voice

Tone nên là:

- ngắn
- rõ
- thực dụng
- không khoa trương

Tone không nên là:

- nói về thiết kế
- nói về team nội bộ
- nói quá chung kiểu "tất cả trong một"

## 6.2. Từ vựng nên thống nhất

Nên dùng nhất quán:

- `Mục tiêu`
- `Cột mốc`
- `Công việc`
- `Bảng việc`
- `Tập trung`
- `Thói quen`
- `Ghi chú`
- `Dự án`

Nên tránh việc cùng một khái niệm nhưng đổi tên liên tục:

- `task board` / `board`
- `dashboard` / `bảng làm việc`
- `module` / `tính năng`

## 6.3. Ví dụ copy thay thế

### Metadata

Hiện trạng:

- nói về `Figma`

Đề xuất:

- `Ứng dụng quản lý mục tiêu cá nhân giúp bạn chia mục tiêu thành cột mốc, theo dõi công việc và giữ nhịp làm việc mỗi ngày.`

### Hero headline

Đề xuất:

- `Biến mục tiêu lớn thành việc làm mỗi ngày.`

### Hero subcopy

Đề xuất:

- `Theo dõi mục tiêu, chia nhỏ thành cột mốc và kéo việc theo trạng thái trong một giao diện gọn, dễ quay lại.`

### Final CTA headline

Đề xuất:

- `Bắt đầu gọn hơn, làm việc rõ hơn mỗi ngày.`

### Final CTA subcopy

Đề xuất:

- `Tạo tài khoản để gom mục tiêu, việc cần làm và nhịp tập trung vào một luồng duy nhất.`

## 7. Hệ visual đề xuất

## 7.1. Màu

Hướng chỉnh:

- giữ nền sáng
- giảm bớt cảm giác candy của tím/hồng
- tăng neutral ấm
- accent chỉ dùng để nhấn trọng tâm

Ưu tiên:

- nền trắng hoặc trắng ngà
- viền `#ECE7E1`
- text chính đậm
- text phụ đủ contrast

## 7.2. Mascot

Mascot hiện tại không phải vấn đề lớn, nhưng cần rule rõ:

- chỉ làm ornament
- không gánh vai trò truyền tải sản phẩm
- không để mascot cạnh tranh headline hoặc CTA

Khuyến nghị:

- Giữ 1-2 mascot badge trong hero là đủ
- Nếu cần thêm personality, dùng ở empty state hoặc CTA phụ

## 7.3. Bóng và lớp nền

Khuyến nghị:

- giảm số lượng gradient chồng lớp
- ưu tiên viền, spacing, block hierarchy
- shadow mỏng, thấp, mềm

## 8. Technical plan

## 8.1. Refactor file

Hiện tại `page.tsx` đang ôm:

- copy
- content data
- hero
- mockup
- mascot art
- CTA cuối

Khuyến nghị tách ra:

- `src/features/landing/content.ts`
- `src/features/landing/components/public-home-hero.tsx`
- `src/features/landing/components/public-home-preview.tsx`
- `src/features/landing/components/public-home-features.tsx`
- `src/features/landing/components/public-home-final-cta.tsx`

Lợi ích:

- dễ sửa copy
- dễ test từng section
- dễ thay đổi layout mà không làm file chính phình tiếp

## 8.2. Cleanup

Nên dọn:

- import thừa
- id section không dùng
- CTA sai route
- nhãn tiếng Anh còn sót

## 8.3. Metadata

Ngoài metadata riêng của page, cần đối chiếu luôn:

- `next-app/src/app/layout.tsx`

Mục tiêu:

- title và description ở root không mang giọng "nền tảng mới"
- thống nhất voice với landing page

## 9. Thứ tự triển khai khuyến nghị

## Giai đoạn 1 - Sửa lỗi và copy

- sửa nav chết
- bỏ `Contact`
- Việt hóa nhãn
- viết lại metadata
- bỏ copy nội bộ ở section cuối

Kết quả mong đợi:

- page hết lỗi UX cơ bản
- tăng độ tin cậy ngay

## Giai đoạn 2 - Gọn lại cấu trúc nội dung

- giảm trùng lặp giữa preview và modules
- viết lại final section thành flow hoặc CTA chuẩn
- làm rõ vai trò từng section

Kết quả mong đợi:

- page ngắn hơn nhưng hiểu nhanh hơn

## Giai đoạn 3 - Tinh chỉnh visual

- chỉnh palette gần hơn với app
- cân lại spacing, shadow, contrast
- tinh chỉnh focus states và accessibility

Kết quả mong đợi:

- cảm giác polished hơn
- vào app không bị lệch brand

## Giai đoạn 4 - Refactor code

- tách components
- tách content config
- dọn import thừa

Kết quả mong đợi:

- dễ bảo trì
- dễ tiếp tục iterate

## 10. Definition of done

Landing page được coi là đạt khi:

- không còn link chết
- không còn CTA sai kỳ vọng
- không còn copy nội bộ/dev trên giao diện public
- ngôn ngữ thống nhất
- section cuối đóng vai trò CTA thật
- cấu trúc nội dung không còn lặp vô ích
- visual tone gần với app bên trong
- keyboard focus và contrast ở mức chấp nhận được

## 11. Kết luận

Landing page hiện tại đã có nền tốt về mặt bố cục và định hướng thị giác. Vấn đề lớn nhất không nằm ở "đẹp hay không đẹp", mà nằm ở chỗ trang vẫn còn cảm giác bản draft: một vài link chưa chốt, copy còn nói chuyện nội bộ, và các section chưa phân vai thật rành.

Nếu chỉ làm một đợt ngắn, ưu tiên cao nhất là:

1. sửa nav và CTA
2. viết lại copy
3. thay section cuối bằng CTA/flow thật
4. giảm trùng lặp nội dung

Làm xong 4 việc này, landing page sẽ tăng chất lượng rõ rệt ngay cả khi chưa cần thay đổi nhiều về visual.

## 12. Trạng thái triển khai

Các hạng mục chính trong tài liệu này đã được triển khai:

- sửa điều hướng và CTA sai kỳ vọng
- viết lại copy public-facing và metadata
- thống nhất ngôn ngữ tiếng Việt
- giảm trùng lặp giữa preview và section tính năng
- thay section cuối bằng flow `3 bước`
- kéo palette và bề mặt visual về gần dashboard hơn
- thêm focus states và dọn phần decor cho đúng vai trò trang trí
- tách landing page khỏi một file duy nhất sang thư mục `src/features/landing/`

Các file đã được tách ra:

- `src/features/landing/content.ts`
- `src/features/landing/theme.ts`
- `src/features/landing/components/public-home-header.tsx`
- `src/features/landing/components/public-home-hero.tsx`
- `src/features/landing/components/public-home-preview.tsx`
- `src/features/landing/components/public-home-features.tsx`
- `src/features/landing/components/public-home-start.tsx`

Mục còn lại mang tính tùy chọn, không còn là lỗi hay thiếu sót trực tiếp của landing page:

- cá nhân hóa preview bằng dữ liệu thật khi user đã đăng nhập
- tiếp tục tinh chỉnh micro-copy theo định vị sản phẩm nếu scope thương hiệu thay đổi
