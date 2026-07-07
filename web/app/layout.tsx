import Sidebar from "@/components/Sidebar";
import ClinicalHeader from "@/components/ClinicalHeader";
import DemoBanner from "@/components/DemoBanner";
import "./globals.css";

export const metadata = {
  title: "VisionFlow Clinical Copilot",
  description: "Real-time ophthalmology clinical intelligence platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Sidebar />
        <main className="ml-64 min-h-screen p-8">
          <ClinicalHeader />
          <DemoBanner />
          {children}
        </main>
      </body>
    </html>
  );
}
