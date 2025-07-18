import { Metadata } from "next";
import * as React from "react";

import UploadTabs from "@/components/sessions/upload/upload-tabs";
import { getPatientsUseCase } from "@/use-cases/patients";

export const metadata: Metadata = {
  title: "Upload",
  description: "Upload new session",
};

export default async function SessionRecordingPage() {
  const patients = await getPatientsUseCase();

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Session Recording
          </h1>
          <p className="text-gray-600">
            Upload and analyze therapy session recordings
          </p>
        </div>
      </div>

      <UploadTabs patients={patients} />
    </div>
  );
}
