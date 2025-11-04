import React from 'react';

export const SunnyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" {...props}>
    <g className="text-yellow-400">
      <circle cx="32" cy="32" r="10" fill="currentColor"/>
      <g className="animate-spin-slow">
        <path d="M32 4 L32 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path d="M50.6 13.4 L46.1 17.9" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path d="M60 32 L54 32" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path d="M50.6 50.6 L46.1 46.1" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path d="M32 60 L32 54" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path d="M13.4 50.6 L17.9 46.1" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path d="M4 32 L10 32" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path d="M13.4 13.4 L17.9 17.9" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      </g>
    </g>
  </svg>
);