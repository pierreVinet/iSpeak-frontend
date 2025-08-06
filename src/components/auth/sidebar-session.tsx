import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Session } from "next-auth";
import SignOutButton from "./sign-out-button";
import { Skeleton } from "../ui/skeleton";

const SidebarSession = ({ session }: { session: Session | null }) => {
  return (
    <div className="flex flex-row justify-between items-center w-full gap-2">
      <div className="w-[60%]">
        {session ? (
          <>
            <p className="text-secondary-foreground font-medium truncate">
              {session.user.name}
            </p>
            <p className="text-muted-foreground text-sm truncate">
              {session.user.email}
            </p>
          </>
        ) : (
          <>
            <Skeleton className="w-full h-10" />
          </>
        )}
      </div>
      {session ? <SignOutButton /> : <Skeleton className="w-22 h-10" />}
    </div>
  );
};

export default SidebarSession;
