import ISpeakLogo from "@/components/general/ispeak-logo";
import LLUIiSpeakLogo from "@/components/general/llui-ispeak-logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-20 p-4 gap-6">
      <LLUIiSpeakLogo />
      <h1 className="text-4xl font-bold text-center">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 text-center">
        The page you are looking for does not exist.
      </p>
      <Button asChild>
        <Link href="/dashboard" className="text-blue-500">
          Go back to home
        </Link>
      </Button>
    </main>
  );
};

export default NotFound;
