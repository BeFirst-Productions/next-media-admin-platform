import * as React from "react";
import Image from "next/image";

interface NextLogoProps {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function NextLogo({
  className = "",
  width = 150,
  height = 53,
  priority = true,
}: NextLogoProps) {
  return (
    <div className={`next-logo-container flex items-center justify-center select-none ${className}`}>
      <Image
        src="/logo.svg"
        alt="Next Media Logo"
        width={width}
        height={height}
        priority={priority}
        unoptimized
        className="h-10 w-auto max-w-full object-contain drop-shadow-[0_0_12px_rgba(0,197,255,0.2)]"
      />
    </div>
  );
}
