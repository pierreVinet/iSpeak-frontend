import { AppSidebar } from "@/components/general/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Dashboard for voice analytics for Speech and Language Therapists",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex w-full">
        <AppSidebar />
        <SidebarInset className="bg-sidebar flex-1 min-w-0">
          <Toaster richColors theme="light" />
          <NextTopLoader
            color="var(--primary)"
            initialPosition={0.1}
            crawlSpeed={200}
            height={5}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
          />
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
