import ISpeakLogo from "@/components/general/ispeak-logo";
import React from "react";

const HeaderAuth = ({ rightNode }: { rightNode?: React.ReactNode }) => {
  return (
    <header className="flex flex-col items-center w-full py-6">
      <div className="flex flex-row justify-between w-full max-w-6xl">
        <ISpeakLogo />
        {rightNode}
      </div>
    </header>
  );
};

export default HeaderAuth;
