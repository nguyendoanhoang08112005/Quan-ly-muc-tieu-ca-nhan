import type { Route } from "next";

export const navigationItems = [
  { href: "/dashboard" as Route, label: "Bảng điều khiển" },
  { href: "/goals" as Route, label: "Mục tiêu" },
  { href: "/follows" as Route, label: "Theo dõi" },
  { href: "/tasks" as Route, label: "Công việc" },
  { href: "/projects" as Route, label: "Dự án" },
  { href: "/habits" as Route, label: "Thói quen" },
  { href: "/notes" as Route, label: "Ghi chú" },
  { href: "/pomodoro" as Route, label: "Pomodoro" },
  { href: "/notifications" as Route, label: "Thông báo" },
  { href: "/categories" as Route, label: "Danh mục" },
  { href: "/tags" as Route, label: "Thẻ" },
  { href: "/settings/profile" as Route, label: "Cài đặt" }
] as const;
