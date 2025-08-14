"use client";

import { sidebarNavigationItems } from "@/app/dashboard/costants";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import LLUIiSpeakLogo from "./llui-ispeak-logo";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import SidebarSession from "../auth/sidebar-session";

export function AppSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Function to determine if a navigation item is active
  const isActiveItem = (itemUrl: string) => {
    if (itemUrl === "/dashboard") {
      // For the home/dashboard route, only match exactly
      return pathname === "/dashboard";
    }
    // For other routes, match if the current path starts with the item URL
    return pathname.startsWith(itemUrl);
  };

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="bg-sidebar! border-gray-100 h-44  p-0">
        <SidebarMenu className="h-full bg-background!">
          <SidebarMenuItem className="h-full">
            <LLUIiSpeakLogo className="ml-10" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarNavigationItems.map((item) => {
                const isActive = isActiveItem(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        className={cn(
                          "w-full text-left text-base! text-secondary-foreground h-10 cursor-pointer relative",
                          item.disabled ? "opacity-50" : " hover:bg-muted",
                          isActive && " bg-muted font-bold"
                        )}
                        href={`${item.url}`}
                      >
                        {/* Small rectangle indicator for active item */}
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-sm" />
                        )}
                        <item.icon className="h-5! w-5! mr-4 ml-8" />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="pb-10 bg-background">
        <SidebarMenu>
          <SidebarMenuItem className="w-full flex flex-row justify-between px-2">
            <SidebarSession session={session} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
