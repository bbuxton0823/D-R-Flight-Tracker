import React from 'react';
import { TripLeg } from '../types';

interface TabsProps {
  tripLegs: TripLeg[];
  activeTabIndex: number;
  onTabChange: (index: number) => void;
}

const Tabs: React.FC<TabsProps> = ({ tripLegs, activeTabIndex, onTabChange }) => {
  return (
    <div className="border-b border-gray-700">
      <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <nav className="-mb-px flex flex-nowrap space-x-4 sm:space-x-8" aria-label="Tabs">
          {tripLegs.map((leg, index) => (
            <button
              key={leg.title}
              onClick={() => onTabChange(index)}
              className={`${
                index === activeTabIndex
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none transition-colors duration-200 text-center`}
              aria-current={index === activeTabIndex ? 'page' : undefined}
            >
              <span className="font-bold block">{leg.title}</span>
              <span className="text-xs">{leg.date}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Tabs;