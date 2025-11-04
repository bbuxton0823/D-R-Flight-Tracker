import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ShutdownAlert from './components/ShutdownAlert';
import DataSources from './components/DataSources';
import Tabs from './components/Tabs';
import type { TripData, TripLeg, Source, ShutdownAlertData } from './types';
import { fetchTripLegData } from './services/geminiService';
import LoadingIndicator from './components/LoadingIndicator';

const initialTripData: TripData = {
    tripLegs: [
        { title: 'Flights to Miami', date: 'Nov 6th & 7th', airports: [] },
        { title: 'Flight to P. Plata', date: 'Nov 7th', airports: [] },
        { title: 'Flight from P. Plata', date: 'Nov 11th', airports: [] },
        { title: 'Flights Home', date: 'Nov 11th', airports: [] },
    ],
    shutdownAlert: { level: 'None', message: '' }
};

const App: React.FC = () => {
  const [tripData, setTripData] = useState<TripData>(initialTripData);
  const [loadedLegs, setLoadedLegs] = useState<boolean[]>([false, false, false, false]);
  const [sources, setSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState<boolean[]>([false, false, false, false]);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const loadLegData = useCallback(async (legIndex: number, forceRefresh = false) => {
    setIsLoading(prev => {
        const newIsLoading = [...prev];
        newIsLoading[legIndex] = true;
        return newIsLoading;
    });

    if (!forceRefresh) {
        setError(null);
    }
    try {
      const { leg, sources: newSources, shutdownAlert } = await fetchTripLegData(legIndex);
      
      setTripData(prevData => {
          const newTripLegs = [...prevData.tripLegs];
          newTripLegs[legIndex] = leg;
          return {
              ...prevData,
              tripLegs: newTripLegs,
              shutdownAlert: shutdownAlert || prevData.shutdownAlert,
          };
      });

      setLoadedLegs(prev => {
          const newLoaded = [...prev];
          newLoaded[legIndex] = true;
          return newLoaded;
      });
      
      setSources(prevSources => {
          const existingUris = new Set(prevSources.map(s => s.uri));
          const uniqueNewSources = newSources.filter(s => !existingUris.has(s.uri));
          return [...prevSources, ...uniqueNewSources];
      });

      setLastUpdated(new Date());
    } catch (err) {
      setError('An unexpected error occurred while fetching data.');
      console.error(err);
    } finally {
      setIsLoading(prev => {
          const newIsLoading = [...prev];
          newIsLoading[legIndex] = false;
          return newIsLoading;
      });
    }
  }, []);

  // Effect to load the active tab if it's not already loaded or loading
  useEffect(() => {
    if (!loadedLegs[activeTabIndex] && !isLoading[activeTabIndex]) {
      loadLegData(activeTabIndex);
    }
  }, [activeTabIndex, loadedLegs, isLoading, loadLegData]);
  
  // Effect to preload other tabs in the background
  useEffect(() => {
    const anyLoaded = loadedLegs.some(l => l);
    if (!anyLoaded) return; // Don't start preloading until at least one tab is loaded

    const nextToPreloadIndex = loadedLegs.findIndex((loaded, index) => !loaded && !isLoading[index]);
    
    if (nextToPreloadIndex !== -1) {
      loadLegData(nextToPreloadIndex);
    }
  }, [loadedLegs, isLoading, loadLegData]);

  const handleRefresh = useCallback(() => {
    loadLegData(activeTabIndex, true);
  }, [activeTabIndex, loadLegData]);

  const renderContent = () => {
    const isInitialLoading = isLoading[0] && !loadedLegs.some(l => l);

    if (isInitialLoading) {
      return (
        <LoadingIndicator message="Tracking your group's flights..." />
      );
    }

    if (error) {
      return (
        <div className="text-center py-20 px-4">
          <p className="text-red-400">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      );
    }
    
    const isCurrentLegLoaded = loadedLegs[activeTabIndex];
    const isCurrentLegLoading = isLoading[activeTabIndex];
    const activeLeg = tripData.tripLegs[activeTabIndex];

    return (
      <>
        {tripData.shutdownAlert?.level !== 'None' && <ShutdownAlert alertData={tripData.shutdownAlert} />}
        <Tabs
            tripLegs={tripData.tripLegs}
            activeTabIndex={activeTabIndex}
            onTabChange={setActiveTabIndex}
        />
        {isCurrentLegLoading && !isCurrentLegLoaded && (
            <LoadingIndicator message={`Loading flight data for ${activeLeg.title}...`} />
        )}
        {isCurrentLegLoaded && (
            <Dashboard 
                airports={activeLeg.airports} 
                weatherForecast={activeLeg.weatherForecast} 
            />
        )}
        <DataSources sources={sources} />
      </>
    );
  };

  return (
    <div className="bg-gray-900 min-h-screen font-sans text-gray-100">
      <Header onRefresh={handleRefresh} isLoading={isLoading[activeTabIndex]} lastUpdated={lastUpdated} activeTabIndex={activeTabIndex} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;