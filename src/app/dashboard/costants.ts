import { SidebarNavigationItem } from "@/types";
import { FileText, FileUp, FileVideo } from "lucide-react";

import { Home, TrendingUp, Users } from "lucide-react";

export const sidebarNavigationItems: SidebarNavigationItem[] = [
  {
    title: "Home",
    icon: Home,
    url: "/dashboard",
  },
  {
    title: "Upload",
    icon: FileUp,
    url: "/dashboard/sessions/upload",
  },
  {
    title: "Assessments",
    icon: FileText,
    url: "/dashboard/assessments",
  },
  // {
  //   title: "Progress",
  //   icon: TrendingUp,
  //   url: "/dashboard/progress",
  //   disabled: true,
  // },
  // {
  //   title: "Reports",
  //   icon: FileText,
  //   url: "/dashboard/reports",
  //   disabled: true,
  // },
  // {
  //   title: "Patients",
  //   icon: Users,
  //   url: "/dashboard/patients",
  //   disabled: true,
  // },
  // {
  //   title: "Settings",
  //   icon: Settings,
  //   url: "#",
  // },
];

export const analysisTypeDescriptions = {
  acoustic: "Analyze acoustic features like formants, pitch, and intensity.",
  intelligibility:
    "Assess speech intelligibilitiy, comparing spoken words or/and sentences against a reference text.",
};

export const referenceTypeDescriptions = {
  words:
    "Input individual words that serve as the reference or objective for comparison against the spoken audio.",
  sentences:
    "Input complete sentences that serve as the reference or objective for comparison against the spoken audio.",
};
