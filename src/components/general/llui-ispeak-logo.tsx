import Link from "next/link";
import React from "react";
import Image from "next/image";
import ISpeakLogo from "./ispeak-logo";
import { cn } from "@/lib/utils";

const LLUIiSpeakLogo = ({
  link = "/dashboard",
  className,
}: {
  link?: string;
  className?: string;
}) => {
  return (
    <Link
      href={link}
      className={cn(
        "flex flex-col items-start justify-center gap-2 px-3 py-2 h-full p-2",
        className
      )}
    >
      <div className="flex items-center justify-start gap-4 ">
        <Image
          src="/images/logos/Logo_LLUI.png"
          alt="LLUI Logo"
          width={60}
          height={30}
        />
        <div className="flex flex-col">
          <ISpeakLogo link="" />
          {/* <span className="text-xs text-muted-foreground">
            Tele Analytics
          </span> */}
        </div>
      </div>
      <Image
        src="/images/logos/therapy_science_logo_transparent.png"
        alt="Therapy Science Logo"
        width={180}
        height={30}
      />
    </Link>
  );
};

export default LLUIiSpeakLogo;
