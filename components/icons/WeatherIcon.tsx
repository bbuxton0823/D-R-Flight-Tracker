import React from 'react';
import type { WeatherData } from '../../types';
import { SunnyIcon } from './SunnyIcon';
import { CloudyIcon } from './CloudyIcon';
import { PartlyCloudyIcon } from './PartlyCloudyIcon';
import { RainIcon } from './RainIcon';
import { ThunderstormIcon } from './ThunderstormIcon';

interface WeatherIconProps extends React.SVGProps<SVGSVGElement> {
  condition: WeatherData['condition'];
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ condition, ...props }) => {
  switch (condition) {
    case 'Sunny':
      return <SunnyIcon {...props} />;
    case 'Partly Cloudy':
      return <PartlyCloudyIcon {...props} />;
    case 'Cloudy':
      return <CloudyIcon {...props} />;
    case 'Rain':
      return <RainIcon {...props} />;
    case 'Thunderstorm':
      return <ThunderstormIcon {...props} />;
    default:
      return <SunnyIcon {...props} />;
  }
};