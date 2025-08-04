import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sessions",
  description: "Sessions page for iSpeak",
};

export default async function SessionsPage() {
  redirect("/dashboard/");
  return <div>Sessions</div>;
}
