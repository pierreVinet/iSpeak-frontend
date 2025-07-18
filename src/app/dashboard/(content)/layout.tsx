import AppHeader from "@/components/general/app-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | iSpeakTele",
    default: "iSpeakTele",
  },
  description: "Web app for voice analytics for Speech and Language Therapists",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      <div className="w-full p-4 sm:p-8 px-4 sm:px-8 max-w-8xl mx-auto">
        {children}
      </div>
    </>
  );
}
