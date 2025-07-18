import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Session } from "next-auth";
import SignOutButton from "./sign-out-button";

const HelloWorldSession = ({ session }: { session: Session }) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center ">
        <CardTitle className="text-2xl font-bold ">
          Welcome {session.user.name}
        </CardTitle>
        <SignOutButton />
      </CardHeader>
      <CardContent>
        <div className="border border-primary bg-primary/10 rounded-lg p-4 mb-6">
          <p className="text-secondary-foreground font-medium">
            Logged in as: {session.user.name}
          </p>
          <p className="text-muted-foreground text-sm">
            Email: {session.user.email}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HelloWorldSession;
