import React from 'react';

interface FlightPathAnimationProps {
  activeTabIndex: number;
}

const coords = {
  SFO: { x: 100, y: 50 },
  IAH: { x: 500, y: 110 },
  MIA: { x: 950, y: 120 },
  POP: { x: 1100, y: 130 },
};

const pathsByLeg = [
  // Leg 0: Flights to Miami
  [
    `M${coords.SFO.x},${coords.SFO.y} Q525,20 ${coords.MIA.x},${coords.MIA.y}`,
    `M${coords.IAH.x},${coords.IAH.y} Q725,140 ${coords.MIA.x},${coords.MIA.y}`
  ],
  // Leg 1: Flight to P. Plata
  [
    `M${coords.MIA.x},${coords.MIA.y} Q1025,135 ${coords.POP.x},${coords.POP.y}`
  ],
  // Leg 2: Flight from P. Plata
  [
    `M${coords.POP.x},${coords.POP.y} Q1025,135 ${coords.MIA.x},${coords.MIA.y}`
  ],
  // Leg 3: Flights Home
  [
    `M${coords.MIA.x},${coords.MIA.y} Q525,20 ${coords.SFO.x},${coords.SFO.y}`,
    `M${coords.MIA.x},${coords.MIA.y} Q725,140 ${coords.IAH.x},${coords.IAH.y}`
  ],
];


const FlightPathAnimation: React.FC<FlightPathAnimationProps> = ({ activeTabIndex }) => {
  const paths = pathsByLeg[activeTabIndex] || pathsByLeg[0];

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1200 160"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        {paths.map((path, i) => (
          <path
            key={`path-def-${i}`}
            id={`path-${i}`}
            d={path}
            fill="none"
          />
        ))}
      </defs>

      {/* Paths */}
      {paths.map((path, i) => (
        <path
          key={`path-draw-${i}`}
          d={path}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="5 3"
          fill="none"
          className="text-gray-600"
        />
      ))}

      {/* Airports */}
      {Object.entries(coords).map(([code, { x, y }]) => (
        <g key={code} className="text-indigo-400">
          <circle cx={x} cy={y} r="5" fill="currentColor" />
          <text x={x + 10} y={y + 5} fontSize="14" fill="currentColor" className="font-bold">
            {code}
          </text>
        </g>
      ))}

      {/* Animated planes */}
      {paths.map((_, i) => (
         <circle key={`plane-${i}`} r="4" className="fill-indigo-400 opacity-90">
            <animateMotion
                dur={`${4 + i * 0.5}s`}
                repeatCount="indefinite"
                begin={`${i * 0.5}s`}
            >
                <mpath href={`#path-${i}`} />
            </animateMotion>
        </circle>
      ))}
    </svg>
  );
};

export default FlightPathAnimation;