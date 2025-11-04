import React from 'react';

export const RainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" {...props}>
    <g className="text-gray-400">
        <path d="M46.6,29.2c-0.3-6.2-5.4-11.2-11.7-11.2c-4.4,0-8.3,2.4-10.4,6.1c-0.4-0.1-0.9-0.1-1.3-0.1c-5.4,0-9.8,4.4-9.8,9.8 c0,0.4,0,0.8,0.1,1.2" fill="currentColor" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeMiterlimit="10"/>
    </g>
    <g className="text-blue-400">
      <path className="animate-fall" style={{animationDelay: '0s'}} d="M24 44 L28 52" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <path className="animate-fall" style={{animationDelay: '0.3s'}} d="M32 44 L36 52" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <path className="animate-fall" style={{animationDelay: '0.6s'}} d="M40 44 L44 52" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </g>
  </svg>
);