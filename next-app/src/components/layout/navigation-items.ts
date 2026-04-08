import type { Route } from "next";

export type NavigationItem = {
  href: Route;
  label: string;
};

export type NavigationGroup = {
  id: string;
  label: string;
  description: string;
  items: readonly NavigationItem[];
  defaultOpen?: boolean;
};

export const primaryNavigationItems = [
  { href: "/dashboard" as Route, label: "Trang chủ" },
  { href: "/goals" as Route, label: "Mục tiêu" },
  { href: "/tasks" as Route, label: "Công việc" },
  { href: "/habits" as Route, label: "Thói quen" }
] as const satisfies readonly NavigationItem[];

export const secondaryNavigationGroups = [
  {
    id: "workspace",
    label: "Không gian mở rộng",
    description: "Dùng khi bạn cần quản lý sâu hơn ngoài 3 khu vực chính.",
    items: [
      { href: "/projects" as Route, label: "Dự án" },
      { href: "/notes" as Route, label: "Ghi chú" },
      { href: "/follows" as Route, label: "Theo dõi" },
      { href: "/notifications" as Route, label: "Thông báo" }
    ]
  },
  {
    id: "tools",
    label: "Công cụ nâng cao",
    description: "Chỉ mở khi thật sự cần tinh chỉnh cách làm việc.",
    items: [
      { href: "/pomodoro" as Route, label: "Pomodoro" },
      { href: "/categories" as Route, label: "Danh mục" },
      { href: "/tags" as Route, label: "Thẻ" },
      { href: "/settings/profile" as Route, label: "Cài đặt" }
    ]
  }
] as const satisfies readonly NavigationGroup[];

export const navigationGroups = [
  {
    id: "primary",
    label: "Bắt đầu từ đây",
    description: "Nếu mới dùng, bạn chỉ cần đi qua 4 mục này.",
    items: primaryNavigationItems,
    defaultOpen: true
  },
  ...secondaryNavigationGroups
] as const satisfies readonly NavigationGroup[];
