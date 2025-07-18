import React from "react";

const TabsNumber = ({ number }: { number: number }) => {
  return (
    <span className="w-6 flex items-center justify-center text-sm font-bold aspect-square rounded-full bg-primary/80 text-primary-foreground mr-2">
      {number}
    </span>
  );
};

export default TabsNumber;
