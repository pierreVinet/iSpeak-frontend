import React from "react";

interface TypeHeaderProps {
  title: string;
  description: string;
}

const TypeHeader = ({ title, description }: TypeHeaderProps) => {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default TypeHeader;
