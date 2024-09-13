import React from "react";
import Image from "next/image";

type LogoBarProps = {
  src: string;
};

export const LogoBar = ({ src }: LogoBarProps) => {
  return (
    <div className="flex items-center justify-center h-16">
      <div className="flex items-center justify-center space-x-4">
        <a href="/" className="text-accent-foreground font-bold text-2xl">
          <Image src={src} alt="Logo" />
        </a>
      </div>
    </div>
  );
};