import FileUploadProvider from "@/contexts/file-upload";
import React from "react";

const SessionsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <FileUploadProvider>{children}</FileUploadProvider>
    </div>
  );
};

export default SessionsLayout;
