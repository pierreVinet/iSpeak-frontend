"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PasswordInput({
  className,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("pr-10 ph-no-capture", className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Eye className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="sr-only">
          {showPassword ? "Hide password" : "Show password"}
        </span>
      </Button>
    </div>
  );
}
