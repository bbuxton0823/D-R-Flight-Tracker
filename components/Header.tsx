import React from 'react';
import { RefreshIcon } from './icons/RefreshIcon';
import FlightPathAnimation from './FlightPathAnimation';
import { TRIP_DATE_RANGE } from '../constants';

interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  lastUpdated: Date | null;
  activeTabIndex: number;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, isLoading, lastUpdated, activeTabIndex }) => {
  return (
    <header className="bg-gray-800/70 backdrop-blur-lg sticky top-0 z-10 border-b border-gray-700 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <FlightPathAnimation activeTabIndex={activeTabIndex} />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-40 sm:h-56">
        {/* Top Right Controls */}
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 lg:right-8">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {lastUpdated && (
              <p className="text-xs text-gray-400 hidden sm:block">
                Updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-full text-gray-400 bg-gray-900/50 hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Refresh data"
            >
              <RefreshIcon className={`h-6 w-6 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bottom Left Title */}
        <div className="absolute bottom-4 left-4 sm:left-6 lg:left-8">
          <h1 className="text-2xl font-bold text-white">
            Flight Tracker ✈️
          </h1>
          <p className="text-sm text-gray-400">{TRIP_DATE_RANGE}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;