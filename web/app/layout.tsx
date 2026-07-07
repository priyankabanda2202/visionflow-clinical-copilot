import Sidebar from "@/components/Sidebar";
import ClinicalHeader from "@/components/ClinicalHeader";
import HospitalStatusBar from "@/components/HospitalStatusBar";
import AppFooter from "@/components/AppFooter";
import InAppBrowserFix from "@/components/InAppBrowserFix";
import ColdStartGuard from "@/components/ColdStartGuard";
import MobileBottomNav from "@/components/MobileBottomNav";
import { BranchProvider } from "@/lib/branchContext";
import { NavProvider } from "@/lib/navContext";
import "./globals.css";

export const metadata = {
  title: "VisionFlow Eye Institute — Clinical Platform",
  description: "Real-time ophthalmology clinical intelligence platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        {/* Before React: fix LinkedIn / in-app browser layout */}
        <script src="/mobile-shell.js?v=3" />
      </head>
      <body>
        <InAppBrowserFix />
        <div className="app-bg" />
        <div className="app-grid" />
        <ColdStartGuard>
          <BranchProvider>
            <NavProvider>
              <Sidebar />
              <main className="relative z-10 min-h-screen w-full max-w-full overflow-x-hidden px-3 pb-20 pt-[4.25rem] md:ml-[272px] md:px-8 md:pb-8 md:pt-8">
                <ClinicalHeader />
                <HospitalStatusBar />
                {children}
                <AppFooter />
              </main>
              <MobileBottomNav />
            </NavProvider>
          </BranchProvider>
        </ColdStartGuard>
      </body>
    </html>
  );
}
