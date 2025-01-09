"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

const VeryTopBackButton = React.forwardRef(({ className, ...props }, ref) => {
  const handleBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  return (
    <button
      onClick={handleBack}
      className={cn(
        "absolute top-4 left-4 z-50 p-2 rounded-full bg-white shadow-md",
        className
      )}
      ref={ref}
      {...props}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 19L3 12L10 5"
          stroke="#1E1E1E"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 12H21"
          stroke="#1E1E1E"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
});

VeryTopBackButton.displayName = "VeryTopBackButton";

export { VeryTopBackButton };
