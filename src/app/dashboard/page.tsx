import { redirect } from "next/navigation";
import { getAuthSession } from "@/server/auth";
import HomeHeader from "@/components/dashboard/home-header";
import HelloWorldSession from "@/components/auth/hello-world-session";
import UploadFileCard from "@/components/general/upload-file-card";
import RecentAssessmentsCard from "@/components/dashboard/recent-assessments-card";
import { getAssessmentsUseCase } from "@/use-cases/assessments";
import { getPatientsUseCase } from "@/use-cases/patients";

export default async function DashboardPage() {
  const session = await getAuthSession();
  const [assessments, patients] = await Promise.all([
    getAssessmentsUseCase(),
    getPatientsUseCase(),
  ]);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen w-full">
      <HomeHeader session={session} />
      <div className="max-w-8xl mx-auto w-full p-4 sm:p-8">
        <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
          <UploadFileCard />
          <RecentAssessmentsCard
            assessments={assessments}
            patients={patients}
          />
          {/* <HelloWorldSession session={session} /> */}
        </section>
      </div>
    </div>
  );
}
