import React from 'react';

export const CocktailIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 14 L 52 14" />
    <path d="M12 14 L 32 38 L 52 14" />
    <path d="M32 38 V 58" />
    <path d="M22 58 H 42" />
    <circle cx="50" cy="20" r="5" fill="currentColor" />
  </svg>
);