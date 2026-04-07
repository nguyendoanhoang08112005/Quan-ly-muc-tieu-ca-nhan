# Scope audit sau buoc 1

## San pham duoc chot
Du an nay hien tai chi xay `quan ly muc tieu ca nhan`.

## Module dang giu lai trong flow chinh
- `auth`
  - Frontend: dang nhap, dang ky, bao ve route
  - Backend: `register`, `login`, `logout`, `user`
- `dashboard`
  - Chi giu o muc tong quan co ban
  - Khong coi day la khu report
- `goals`
  - Danh sach muc tieu
  - Tao muc tieu
  - Day la module nghiep vu trung tam
- `tasks`
  - Chi xem nhu viec can lam theo muc tieu
  - Khong xem nhu cong cu quan ly project/team

## Module tam bo qua
- `projects`
- `subtasks` cu
- `productApi`
- `ProductList`
- `follow`
- cac route/man hinh demo cu nhu `Home_old`, `Home_UX_Enhanced`, `HomeNew`, `Profile`
- cac huong `report`, `calendar`, `chat`, `settings` tren navigation cu
- `habit` va cac man hinh lien quan

## Ket luan don scope
- Frontend navigation chi con tap trung vao `tong quan`, `muc tieu`, `viec can lam`.
- Repo khong con de lo cac man hinh demo san pham hoac huong social.
- Backend khong con file controller demo cho product.
- Domain chinh hien tai la: `auth -> goals -> tasks`.

## Viec con lai cho cac buoc sau
- Chuan hoa schema backend cho `goals` va `tasks`
- Hoan thien Goal API that
- Hoan thien Task API that
- Sau khi flow cot loi on dinh moi tinh den `habit` va `report`
