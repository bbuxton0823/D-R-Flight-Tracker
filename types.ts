export interface Flight {
  flightNumber: string;
  destination: string;
  status: 'On Time' | 'Delayed' | 'Cancelled' | 'Diverted' | 'Landed';
  delayMinutes?: number;
  time: string;
  airline: string;
  aircraft: string;
  gate: string;
  baggageClaim?: string;
}

export interface WaitTimeDetail {
  waitMinutes: string;
  lastUpdated?: string;
}

export interface SecurityWaitTimes {
  standard: string | WaitTimeDetail;
  tsaPreCheck: string | WaitTimeDetail;
  clear: string | WaitTimeDetail;
}

export interface AirportData {
  name: string;
  code: string;
  departures: Flight[];
  securityWaitTimes: SecurityWaitTimes;
}

export interface ShutdownAlertData {
  level: 'None' | 'Warning' | 'Severe';
  message: string;
}

export interface WeatherData {
  date: string;
  dayOfWeek: string;
  condition: 'Sunny' | 'Partly Cloudy' | 'Cloudy' | 'Rain' | 'Thunderstorm';
  description: string;
  rainChance?: number;
  highTemp: number;
  lowTemp: number;
}

export interface TripLeg {
    title: string;
    date: string;
    airports: AirportData[];
    weatherForecast?: WeatherData[];
}

export interface TripData {
    tripLegs: TripLeg[];
    shutdownAlert: ShutdownAlertData;
}

export interface Source {
  uri: string;
  title: string;
}