"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import HeaderAuth from "../components/header-auth";
import FooterAuth from "../components/footer-auth";
import PasswordInput from "@/components/auth/password-input";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials");
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8">
      <HeaderAuth
      // rightNode={
      //   <Link
      //     href="/auth/signup"
      //     className="font-medium text-primary hover:underline"
      //   >
      //     Sign up
      //   </Link>
      // }
      />
      <div className="w-full grow flex flex-col items-center justify-center">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight">
              Log In
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Enter your email below to login to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="h-10"
              />
            </div>

            {error && (
              <div className="text-sm text-red-500 text-center">{error}</div>
            )}

            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
      <FooterAuth />
    </div>
  );
}
