import { getAuthSession } from "@/server/auth";
import AuthButtons from "@/components/auth/auth-buttons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ISpeakLogo from "@/components/general/ispeak-logo";

export default async function Home() {
  const session = await getAuthSession();

  return (
    <div className="min-h-screen flex flex-col ">
      {/* Header */}
      <header className="border-b flex items-center justify-center px-4 sm:px-6 lg:px-8 ">
        <div className="w-full max-w-6xl py-6 flex items-center justify-between">
          <ISpeakLogo />
          <div className="hidden sm:block">
            <AuthButtons />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8 -mt-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              iSpeak
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground">
            Voice analytics dashboard build for Speech and Language Therapists
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <AuthButtons />

            {/* {!session && (
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/auth/signup">Create Account</Link>
              </Button>
            )} */}
          </div>
        </div>
      </main>
    </div>
  );
}
