import React from 'react';
import type { WeatherData } from '../types';
import { WeatherIcon } from './icons/WeatherIcon';
import { WaterDropIcon } from './icons/WaterDropIcon';

interface WeatherForecastProps {
  forecast: WeatherData[];
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ forecast }) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-5 mb-6">
      <h3 className="text-lg font-bold mb-4 text-white">Weather in Puerto Plata</h3>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {forecast.map((day) => (
          <div key={day.date} className="bg-gray-700/50 p-3 rounded-lg flex flex-col text-center items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-gray-300">{day.dayOfWeek}</p>
              <p className="text-xs text-gray-400 mb-2">{day.date}</p>
            </div>
            <div className="w-12 h-12 text-yellow-400 my-1">
              <WeatherIcon condition={day.condition} />
            </div>
            <div className="text-lg">
              <span className="font-bold text-white">{day.highTemp}°</span>
              <span className="text-gray-400">/{day.lowTemp}°</span>
            </div>
            <div className="text-xs mt-2 text-gray-400 flex-grow flex flex-col justify-center">
              {day.rainChance && day.rainChance > 0 && (
                <div className="flex items-center justify-center text-blue-300 mb-1">
                  <WaterDropIcon className="h-3 w-3 mr-1" />
                  <span>{day.rainChance}% rain</span>
                </div>
              )}
              <p>{day.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;