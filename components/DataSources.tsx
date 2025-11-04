import React from 'react';
import type { Source } from '../types';

interface DataSourcesProps {
  sources: Source[];
}

const DataSources: React.FC<DataSourcesProps> = ({ sources }) => {
  if (sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-700">
      <h3 className="text-lg font-semibold mb-2 text-gray-300">Data Sources</h3>
      <ul className="list-disc list-inside space-y-1">
        {sources.map((source, index) => (
          <li key={index} className="text-sm">
            <a
              href={source.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              {source.title || new URL(source.uri).hostname}
            </a>
          </li>
        ))}
      </ul>
      <p className="text-xs text-gray-400 mt-4">
        Data retrieved using Google Search grounding. Please verify critical information with official sources.
      </p>
    </div>
  );
};

export default DataSources;