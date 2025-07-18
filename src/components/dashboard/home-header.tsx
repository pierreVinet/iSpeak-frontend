import { Session } from "next-auth";
import React from "react";
import { SidebarTrigger } from "../ui/sidebar";

const HomeHeader = ({ session }: { session: Session }) => {
  return (
    <header className="flex h-32 md:h-56 gap-2 bg-primary/50">
      <div className="flex items-center justify-between gap-2 max-w-8xl mx-auto w-full px-4 sm:px-8">
        {/* <Separator
          orientation="vertical"
          className="md:hidden max-h-8 bg-secondary-foreground!"
        /> */}
        <h1 className="text-3xl md:text-5xl font-semibold text-secondary-foreground">
          Welcome <br className="hidden md:block" />
          <span className="text-background">{session.user.name}</span>
        </h1>

        <SidebarTrigger className="-ml-1 md:hidden " />
      </div>
    </header>
  );
};

export default HomeHeader;
