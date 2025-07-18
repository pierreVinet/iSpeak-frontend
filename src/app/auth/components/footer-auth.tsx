import React from "react";
import Image from "next/image";

const FooterAuth = () => {
  return (
    <div className="flex flex-col items-center w-full py-6">
      <div className="flex flex-row justify-center w-full max-w-6xl">
        <Image
          src="/images/logos/therapy_science_logo.png"
          alt="iSpeak Logo"
          className="h-10 w-auto"
          width={300}
          height={100}
        />
      </div>
    </div>
  );
};

export default FooterAuth;
