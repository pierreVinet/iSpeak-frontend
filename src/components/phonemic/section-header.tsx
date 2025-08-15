import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  variant?: "primary" | "secondary";
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  variant = "primary",
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-4 font-bold",
        variant === "primary" && "text-xl",
        variant === "secondary" && "text-lg",
        className
      )}
    >
      <div className="leading-tight">{title}</div>
      {subtitle && (
        <div className="text-sm font-normal text-gray-600 mt-1">{subtitle}</div>
      )}
    </div>
  );
};

export default SectionHeader;
