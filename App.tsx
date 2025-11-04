import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ShutdownAlert from './components/ShutdownAlert';
import DataSources from './components/DataSources';
import Tabs from './components/Tabs';
import type { TripData, Source } from './types';
import { fetchTripData } from './services/geminiService';

const App: React.FC = () => {
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const loadTripData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, sources } = await fetchTripData();
      if (data) {
        setTripData(data);
        setSources(sources);
        setLastUpdated(new Date());
      } else {
        setError('Failed to fetch trip data. The response was empty.');
      }
    } catch (err) {
      setError('An unexpected error occurred while fetching data.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTripData();
  }, [loadTripData]);

  const renderContent = () => {
    if (isLoading && !tripData) {
      return (
        <div className="text-center py-20">
          <div className="flex justify-center items-center h-24">
            <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g><circle cx="60" cy="60" r="50" fill="none" stroke="#374151" strokeWidth="4" /><path d="M 60,10 A 50,50 0 0,1 104.95,45.05" fill="none" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" from="0 60 60" to="360 60 60" dur="2s" repeatCount="indefinite" /></path><path d="M55 55 L 65 60 L 55 65" fill="#60a5fa" transform="translate(48.5, -15.5) rotate(50 60 60)"><animateTransform attributeName="transform" type="rotate" from="0 60 60" to="360 60 60" dur="2s" repeatCount="indefinite" /></path></g></svg>
          </div>
          <p className="text-lg mt-4 text-gray-400 animate-pulse">
            Tracking your group's flights...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-20 px-4">
          <p className="text-red-400">{error}</p>
          <button
            onClick={loadTripData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      );
    }
    
    if (!tripData) {
        return null;
    }

    const activeLeg = tripData.tripLegs[activeTabIndex];

    return (
      <>
        {tripData.shutdownAlert && <ShutdownAlert alertData={tripData.shutdownAlert} />}
        <Tabs
            tripLegs={tripData.tripLegs}
            activeTabIndex={activeTabIndex}
            onTabChange={setActiveTabIndex}
        />
        <Dashboard 
            airports={activeLeg.airports} 
            weatherForecast={activeLeg.weatherForecast} 
        />
        <DataSources sources={sources} />
      </>
    );
  };

  return (
    <div className="bg-gray-900 min-h-screen font-sans text-gray-100">
      <Header onRefresh={loadTripData} isLoading={isLoading} lastUpdated={lastUpdated} activeTabIndex={activeTabIndex} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;