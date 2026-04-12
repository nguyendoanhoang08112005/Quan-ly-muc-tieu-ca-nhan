import type { Metadata } from "next";
import Script from "next/script";
import { getAppBaseUrl } from "@/lib/env";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: getAppBaseUrl(),
  title: {
    default: "Quản lý mục tiêu cá nhân",
    template: "%s | Quản lý mục tiêu cá nhân"
  },
  description:
    "Ứng dụng quản lý mục tiêu cá nhân giúp bạn chia mục tiêu thành cột mốc, theo dõi công việc và giữ nhịp làm việc mỗi ngày.",
  applicationName: "Quản lý mục tiêu cá nhân",
  openGraph: {
    title: "Quản lý mục tiêu cá nhân",
    description:
      "Ứng dụng quản lý mục tiêu cá nhân giúp bạn chia mục tiêu thành cột mốc, theo dõi công việc và giữ nhịp làm việc mỗi ngày.",
    siteName: "Quản lý mục tiêu cá nhân",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-scroll-behavior="smooth" lang="vi">
      <head>
        <Script id="strip-browser-extension-attrs" strategy="beforeInteractive">
          {`(() => {
            const extensionAttrs = ["bis_skin_checked"];

            const removeExtensionAttrs = (root = document) => {
              for (const attr of extensionAttrs) {
                const nodes = root.querySelectorAll ? root.querySelectorAll("[" + attr + "]") : [];
                for (const node of nodes) {
                  node.removeAttribute(attr);
                }
              }
            };

            const sanitizeNode = (node) => {
              if (!(node instanceof Element)) {
                return;
              }

              for (const attr of extensionAttrs) {
                if (node.hasAttribute(attr)) {
                  node.removeAttribute(attr);
                }
              }

              removeExtensionAttrs(node);
            };

            removeExtensionAttrs();

            const observer = new MutationObserver((mutations) => {
              for (const mutation of mutations) {
                if (mutation.type === "attributes") {
                  sanitizeNode(mutation.target);
                }

                for (const node of mutation.addedNodes) {
                  sanitizeNode(node);
                }
              }
            });

            observer.observe(document.documentElement, {
              subtree: true,
              childList: true,
              attributes: true,
              attributeFilter: extensionAttrs
            });

            window.addEventListener("load", () => {
              removeExtensionAttrs();
              setTimeout(() => observer.disconnect(), 5000);
            }, { once: true });
          })();`}
        </Script>
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
