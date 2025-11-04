import React from 'react';
import type { AirportData, WeatherData } from '../types';
import AirportCard from './AirportCard';
import WeatherForecast from './WeatherForecast';

interface DashboardProps {
  airports: AirportData[];
  weatherForecast?: WeatherData[];
}

const Dashboard: React.FC<DashboardProps> = ({ airports, weatherForecast }) => {
  const isSingleCard = airports.length === 1;

  return (
    <div className="mt-4 sm:mt-6">
      {weatherForecast && weatherForecast.length > 0 && (
        <WeatherForecast forecast={weatherForecast} />
      )}
      <div className={`grid grid-cols-1 ${isSingleCard ? 'lg:grid-cols-1 lg:max-w-2xl lg:mx-auto' : 'lg:grid-cols-2'} gap-4 sm:gap-6 lg:gap-8 ${weatherForecast ? 'mt-6' : ''}`}>
        {airports.map((airport) => (
          <AirportCard key={airport.code} airportData={airport} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;