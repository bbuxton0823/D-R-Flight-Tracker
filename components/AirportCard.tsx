import React, { useState } from 'react';
import type { AirportData, Flight, WaitTimeDetail } from '../types';
import { PlaneIcon } from './icons/PlaneIcon';
import { ClockIcon } from './icons/ClockIcon';
import { BaggageIcon } from './icons/BaggageIcon';
import { GateIcon } from './icons/GateIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { AircraftIcon } from './icons/AircraftIcon';

const getStatusColor = (status: Flight['status']) => {
  switch (status) {
    case 'On Time':
      return 'text-green-400';
    case 'Delayed':
      return 'text-orange-400';
    case 'Cancelled':
      return 'text-red-400';
    case 'Diverted':
      return 'text-blue-400';
    case 'Landed':
      return 'text-purple-400';
    default:
      return 'text-gray-400';
  }
};

const renderWaitTime = (time: string | WaitTimeDetail | undefined): string => {
  if (!time) return 'N/A';
  if (typeof time === 'object' && 'waitMinutes' in time) {
    return time.waitMinutes;
  }
  return String(time);
};

// Fix: Defined the AirportCardProps interface.
interface AirportCardProps {
  airportData: AirportData;
}

const AirportCard: React.FC<AirportCardProps> = ({ airportData }) => {
  const [expandedFlight, setExpandedFlight] = useState<string | null>(null);

  const handleToggleFlight = (flightNumber: string) => {
    setExpandedFlight(prev => (prev === flightNumber ? null : flightNumber));
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
      <div className="p-5 border-b border-gray-700">
        <h2 className="text-xl font-bold">{airportData.name} ({airportData.code})</h2>
      </div>
      <div className="p-5 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <PlaneIcon className="h-5 w-5 mr-2 transform -rotate-45" /> Departures
          </h3>
          <div className="divide-y divide-gray-700 -mx-5">
            {airportData.departures.map((flight) => {
              const isExpanded = expandedFlight === flight.flightNumber;
              return (
                <div key={flight.flightNumber}>
                  <div
                    onClick={() => handleToggleFlight(flight.flightNumber)}
                    className="flex items-center justify-between py-3 px-5 cursor-pointer hover:bg-gray-700/50 transition-colors"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleToggleFlight(flight.flightNumber)}}
                    aria-expanded={isExpanded}
                    aria-controls={`flight-details-${flight.flightNumber}`}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <PlaneIcon className="h-5 w-5 transform -rotate-45" />
                      </div>
                      <div className="ml-4">
                        <p className="font-semibold text-sm">{flight.flightNumber}</p>
                        <p className="text-xs text-gray-400">
                          To: {flight.destination}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-right mr-4">
                        <p className={`font-medium text-sm ${getStatusColor(flight.status)}`}>
                          {flight.status}
                          {flight.status === 'Delayed' && ` (${flight.delayMinutes}m)`}
                        </p>
                        <p className="text-xs text-gray-400">{flight.time}</p>
                      </div>
                      <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  <div 
                    id={`flight-details-${flight.flightNumber}`}
                    className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                    <div className="overflow-hidden">
                       <div className="bg-gray-900/50 px-5 pt-3 pb-4 space-y-3">
                         <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center text-gray-400">
                                <AircraftIcon className="h-4 w-4 mr-2" />
                                <span>Airline</span>
                            </div>
                           <span className="font-medium">{flight.airline}</span>
                         </div>
                         <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center text-gray-400">
                                <PlaneIcon className="h-4 w-4 mr-2" />
                                <span>Aircraft</span>
                            </div>
                           <span className="font-medium">{flight.aircraft}</span>
                         </div>
                         <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center text-gray-400">
                                <GateIcon className="h-4 w-4 mr-2" />
                                <span>Gate</span>
                            </div>
                           <span className="font-medium">{flight.gate}</span>
                         </div>
                         {flight.baggageClaim && (
                           <div className="flex justify-between items-center text-sm">
                             <div className="flex items-center text-gray-400">
                                <BaggageIcon className="h-4 w-4 mr-2" />
                                <span>Baggage Claim</span>
                             </div>
                             <span className="font-medium">{flight.baggageClaim}</span>
                           </div>
                         )}
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
         <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <ClockIcon className="h-5 w-5 mr-2" /> Security Wait Times
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
                <span className="text-gray-400">Standard</span>
                <span className="font-semibold px-2 py-1 bg-gray-700 rounded-md">{renderWaitTime(airportData.securityWaitTimes.standard)}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-400">TSA PreCheck®</span>
                <span className="font-semibold px-2 py-1 bg-gray-700 rounded-md">{renderWaitTime(airportData.securityWaitTimes.tsaPreCheck)}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-400">CLEAR</span>
                <span className="font-semibold px-2 py-1 bg-gray-700 rounded-md">{renderWaitTime(airportData.securityWaitTimes.clear)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirportCard;