import Link from "next/link";
import React from "react";

const ISpeakLogo = ({ link = "/" }: { link?: string }) => {
  if (link) {
    return (
      <Link href={link}>
        <ISpeakText />
      </Link>
    );
  }

  return <ISpeakText />;
};

export default ISpeakLogo;

const ISpeakText = () => {
  return <span className="text-xl sm:text-3xl font-bold">iSpeak</span>;
};
