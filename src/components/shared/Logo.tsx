// src/components/shared/Logo.tsx
import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gradient Background */}
      <defs>
        <linearGradient id="backgroundGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#b3b3b3" />
          <stop offset="100%" stop-color="#666" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#backgroundGradient)" />

      {/* Outer V Shape */}
      <polygon
        points="200,20 380,380 200,280 20,380"
        fill="#FFD700"
        stroke="#333333"
        strokeWidth="8"
      />

      {/* Inner V Shape */}
      <polygon
        points="200,50 350,350 200,250 50,350"
        fill="#333333"
        stroke="#333333"
        strokeWidth="4"
      />

      {/* Inner Triangle */}
      <polygon
        points="200,140 300,320 100,320"
        fill="#FFD700"
        stroke="#333333"
        strokeWidth="4"
      />
    </svg>
  );
};

export default Logo;
