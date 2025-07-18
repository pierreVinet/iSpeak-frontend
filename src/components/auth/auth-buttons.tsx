"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthButtons() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <Button disabled className="w-full sm:w-auto">
        Loading...
      </Button>
    );
  }

  if (status === "authenticated") {
    return (
      <Button asChild className="w-full sm:w-auto">
        <Link href="/dashboard">Go to Dashboard</Link>
      </Button>
    );
  }

  return (
    <Button asChild className="w-full sm:w-auto">
      <Link href="/auth/signin">Log In</Link>
    </Button>
  );
}
