"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({
        redirect: true,
        callbackUrl: "/auth/signin",
      });
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="destructive" onClick={handleSignOut} disabled={loading}>
      {loading ? (
        <>
          <Loader2 className="animate-spin h-4 w-4" />
          Signing out...
        </>
      ) : (
        "Sign out"
      )}
    </Button>
  );
}
