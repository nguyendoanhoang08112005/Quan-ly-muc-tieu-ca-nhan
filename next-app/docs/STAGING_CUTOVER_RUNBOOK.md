# Staging And Cutover Runbook

Tai lieu nay dung cho Phase 21: dua he Next.js moi len staging, chay smoke test,
thuc hien cutover va dan dan dong bang he Laravel + CRA cu mot cach an toan.

## 1. Muc tieu

- Co staging chay doc lap voi health/readiness ro rang.
- Co preflight va smoke script de check moi lan deploy.
- Co quy trinh migration du lieu cuoi cung, freeze va rollback co y thuc.
- Khong archive `frontend/` va `backend/` cho den khi traffic da on dinh.

## 2. Bien moi truong staging toi thieu

Bat dau tu [`.env.staging.example`](/Users/dangduytien/Quan-ly-muc-tieu-ca-nhan/next-app/.env.staging.example).

Can co:

- `APP_STAGE`
- `APP_RELEASE`
- `DATABASE_URL`
- `LEGACY_DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `STAGING_SMOKE_BASE_URL`
- `STAGING_SMOKE_EMAIL`
- `STAGING_SMOKE_PASSWORD`

## 3. Health va readiness

He moi da co:

- `GET /api/ops/health`
- `GET /api/ops/ready`

Quy uoc:

- `health`: check liveness, luon tra `200` neu app boot duoc.
- `ready`: check env bat buoc + ket noi DB, tra `200` khi san sang va `503`
  khi con thieu cau hinh hoac DB loi.

## 4. Trinh tu deploy staging

1. Cap nhat env staging theo file mau.
2. Build app moi.
3. Chay Prisma migration tren DB staging.
4. Seed du lieu demo neu can.
5. Start app Next.js.
6. Goi `health` va `ready`.
7. Chay smoke script.

Lenh khuyen nghi:

```bash
npm run ops:preflight
```

```bash
npm run ops:smoke
```

Neu muon smoke ca flow tao/xoa du lieu tam thoi:

```bash
npm run ops:smoke -- --write
```

## 5. Chuan bi cutover

Can chot ro bang ngay gio tuyet doi, vi du:

- freeze du lieu: `2026-04-15 21:00 Asia/Ho_Chi_Minh`
- bat dau import cuoi: `2026-04-15 21:15 Asia/Ho_Chi_Minh`
- doi traffic: `2026-04-15 22:00 Asia/Ho_Chi_Minh`

Checklist:

- staging xanh o `health`, `ready`, `smoke`
- `npm run legacy:plan` da review xong
- `npm run legacy:import -- --write` da duoc dry-run truoc do
- `npm run legacy:reconcile -- --write` da duoc dry-run truoc do
- co backup cho ca DB cu va DB moi
- co nguoi theo doi log trong cua so cutover

## 6. Cutover ngay phat hanh

1. Bao tri ngan hoac khoa ghi he cu neu can.
2. Backup DB legacy.
3. Chay import du lieu cuoi:

```bash
npm run legacy:import -- --write
```

4. Chay reconcile derive fields:

```bash
npm run legacy:reconcile -- --write
```

5. Chay smoke tren he moi:

```bash
npm run ops:smoke
```

6. Truyen traffic sang `NEXTAUTH_URL` moi / domain moi.
7. Theo doi log auth, dashboard, goals, tasks, notifications.

## 7. Legacy read-only grace period

Khong xoa he cu ngay sau cutover. Nen giu mot grace period de rollback nhanh.

Khuyen nghi:

- giu `backend/` va `frontend/` o che do read-only it nhat 3-7 ngay
- chan cac thao tac ghi moi o he cu
- van cho phep nguoi van hanh doc du lieu va doi chieu neu can

Nhung thu can xu ly sau khi on dinh:

- archive [`frontend/`](/Users/dangduytien/Quan-ly-muc-tieu-ca-nhan/frontend)
- archive [`backend/`](/Users/dangduytien/Quan-ly-muc-tieu-ca-nhan/backend)
- xoa build cu [`backend/public/app`](/Users/dangduytien/Quan-ly-muc-tieu-ca-nhan/backend/public/app)
- bo fallback SPA trong [`backend/routes/web.php`](/Users/dangduytien/Quan-ly-muc-tieu-ca-nhan/backend/routes/web.php)

## 8. Rollback

Chi rollback neu co loi nghiem trong trong cua so cutover.

Trinh tu:

1. Ngung ghi vao he moi.
2. Tra traffic ve he cu.
3. Giu nguyen DB moi de phan tich.
4. Thu thap log tu:
   - auth
   - `/api/ops/ready`
   - dashboard summary
   - goal/task mutations
5. Fix va lap lai dry-run truoc lan cutover tiep theo.

## 9. Done khi

- `ready` tra `200` tren moi instance staging/production
- `ops:smoke` xanh
- traffic chinh da o Next.js
- he cu duoc archive an toan, khong xoa vo tinh
