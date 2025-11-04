import React from 'react';

export const PartlyCloudyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <g className="text-gray-400 animate-drift">
      <path d="M46.6,29.2c-0.3-6.2-5.4-11.2-11.7-11.2c-4.4,0-8.3,2.4-10.4,6.1c-0.4-0.1-0.9-0.1-1.3-0.1c-5.4,0-9.8,4.4-9.8,9.8 c0,0.4,0,0.8,0.1,1.2" fill="currentColor" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeMiterlimit="10"/>
    </g>
  </svg>
);