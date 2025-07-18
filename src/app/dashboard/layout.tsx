import { AppSidebar } from "@/components/general/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "next";

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
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
