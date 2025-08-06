"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import posthog from "posthog-js";

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      posthog.reset();
      await signOut({
        redirect: true,
        callbackUrl: "/auth/signin",
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleSignOut}
      disabled={loading}
      className="text-red-800 hover:text-red-800"
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin h-4 w-4" />
        </>
      ) : (
        "Sign out"
      )}
    </Button>
  );
}
