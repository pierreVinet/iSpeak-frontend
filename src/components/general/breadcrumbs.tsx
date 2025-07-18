"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import { formatUUID } from "@/lib/utils";

const formatPathSegment = (segment: string): string => {
  // Handle empty segments
  if (!segment) return "";

  // First check if it's a UUID
  const formattedUUID = formatUUID(segment);
  if (formattedUUID !== segment) {
    return formattedUUID;
  }

  // Convert kebab-case or snake_case to Title Case
  return segment
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const Breadcrumbs = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // If we're at root or just /dashboard, return minimal breadcrumb
  if (
    segments.length === 0 ||
    (segments.length === 1 && segments[0] === "dashboard")
  ) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>
              <Home className="w-5 h-5" />
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home/Dashboard Link */}
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard" className="">
            <Home className="w-5 h-5" />
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Dynamic Segments */}
        {segments.map((segment, index) => {
          // Skip dashboard in the path segments since we already show it as home
          if (segment === "dashboard") return null;

          // Build the href for this segment
          const href = `/${segments.slice(0, index + 1).join("/")}`;

          // Determine if this is the last segment
          const isLastSegment = index === segments.length - 1;

          return (
            <React.Fragment key={segment}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLastSegment ? (
                  <BreadcrumbPage className="">
                    {formatPathSegment(segment)}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href} className="">
                    {formatPathSegment(segment)}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
