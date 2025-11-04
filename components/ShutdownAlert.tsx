import React from 'react';
import { ShutdownAlertData } from '../types';
import { WarningIcon } from './icons/WarningIcon';

interface ShutdownAlertProps {
  alertData: ShutdownAlertData;
}

const ShutdownAlert: React.FC<ShutdownAlertProps> = ({ alertData }) => {
  if (alertData.level === 'None') {
    return null;
  }

  const alertStyles = {
    Warning: 'bg-yellow-900/50 border-yellow-500 text-yellow-300',
    Severe: 'bg-red-900/50 border-red-500 text-red-300',
  };

  const level = alertData.level as 'Warning' | 'Severe';
  const style = alertStyles[level] || alertStyles.Warning;

  return (
    <div
      className={`mb-6 p-4 border-l-4 rounded-r-lg flex items-start ${style}`}
      role="alert"
    >
      <WarningIcon className="h-6 w-6 mr-3 flex-shrink-0" />
      <div>
        <p className="font-bold">{alertData.level} Alert</p>
        <p>{alertData.message}</p>
      </div>
    </div>
  );
};

export default ShutdownAlert;