import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DevBox",
    template: "%s | DevBox",
  },
  description: "An all-in-one professional utility suite",
  applicationName: "DevBox",
  icons: {
    icon: "/devbox-icon.svg",
    shortcut: "/devbox-icon.svg",
    apple: "/devbox-icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#030712",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}