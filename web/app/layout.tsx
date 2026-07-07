import Sidebar from "@/components/Sidebar";
import "./globals.css";

export const metadata = {
  title: "VisionFlow Clinical Copilot",
  description: "Real-time ophthalmology clinical intelligence platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Sidebar />
        <main className="ml-64 min-h-screen p-8">{children}</main>
      </body>
    </html>
  );
}
