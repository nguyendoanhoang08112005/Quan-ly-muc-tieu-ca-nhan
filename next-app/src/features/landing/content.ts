import {
  BarChart3,
  CheckCircle2,
  LayoutPanelTop,
  NotebookPen,
  Target,
  TimerReset
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type LandingFeatureModule = {
  icon: LucideIcon;
  title: string;
  text: string;
  accent: string;
};

type LandingFeatureGlyph = {
  icon: LucideIcon;
  label: string;
};

type LandingStartStep = {
  step: string;
  title: string;
  text: string;
  accent: string;
};

export const landingPageDescription =
  "Ứng dụng quản lý mục tiêu cá nhân giúp bạn chia mục tiêu thành cột mốc, theo dõi công việc và giữ nhịp làm việc mỗi ngày.";

export const landingFeatureModules: LandingFeatureModule[] = [
  {
    icon: Target,
    title: "Thấy ngay việc quan trọng",
    text: "Mục tiêu, cột mốc và trạng thái công việc nằm trong cùng một luồng thay vì phải ghép từ nhiều màn.",
    accent: "bg-[#fff1e9] text-[#ba6a4d]"
  },
  {
    icon: LayoutPanelTop,
    title: "Thêm và di chuyển rất nhanh",
    text: "Tạo việc ở đúng chỗ, kéo theo trạng thái và giữ nhịp xử lý trong ngày mà không bị ngắt đoạn.",
    accent: "bg-[#fff6f1] text-[#b8694d]"
  },
  {
    icon: TimerReset,
    title: "Quay lại mà không mất đà",
    text: "Tập trung, thói quen và ghi chú nhanh giúp bạn tiếp tục công việc mà không phải dựng lại bối cảnh từ đầu.",
    accent: "bg-[#f4f8ec] text-[#5f7a34]"
  }
];

export const landingPreviewFeatureWallLeft: LandingFeatureGlyph[] = [
  { icon: Target, label: "Mục tiêu" },
  { icon: LayoutPanelTop, label: "Bảng việc" },
  { icon: BarChart3, label: "Tiến độ" }
];

export const landingPreviewFeatureWallRight: LandingFeatureGlyph[] = [
  { icon: NotebookPen, label: "Ghi chú" },
  { icon: TimerReset, label: "Tập trung" },
  { icon: CheckCircle2, label: "Thói quen" }
];

export const landingStartSteps: LandingStartStep[] = [
  {
    step: "01",
    title: "Tạo mục tiêu",
    text: "Xác định điều bạn muốn hoàn thành và gom mọi thứ về cùng một chỗ.",
    accent: "bg-[#fff1e9] text-[#ba6a4d]"
  },
  {
    step: "02",
    title: "Chia thành cột mốc",
    text: "Bẻ nhỏ mục tiêu thành các chặng đủ rõ để theo dõi tiến độ hằng ngày.",
    accent: "bg-[#fff7e8] text-[#b7822f]"
  },
  {
    step: "03",
    title: "Kéo việc và giữ nhịp",
    text: "Làm theo trạng thái, giữ tập trung và quay lại app mà không mất đà.",
    accent: "bg-[#f4f8ec] text-[#5f7a34]"
  }
];
