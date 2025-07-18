import React from "react";
import Breadcrumbs from "./breadcrumbs";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";

const AppHeader = () => {
  return (
    <header className="flex h-20 shrink-0 items-center gap-2 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between w-full px-4 sm:px-8  max-w-8xl mx-auto">
        <div className="flex items-center gap-6">
          <Breadcrumbs />
        </div>

        <SidebarTrigger className="-ml-1 md:hidden " />
      </div>
    </header>
  );
};

export default AppHeader;
