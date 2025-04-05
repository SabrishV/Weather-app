import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface Location {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

interface SearchBarProps {
  onLocationSelect: (city: string, lat?: number, lon?: number) => void;
  onError: (error: string) => void;
}

export default function SearchBar({ onLocationSelect, onError }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchLocation = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Couldn&apos;t fetch location data");
      }
      
      const data: Location[] = await response.json();
      setSuggestions(data || []);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      onError(error instanceof Error ? error.message : 'Error fetching location data');
      setSuggestions([]);
    }
  }, [onError]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        searchLocation(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, searchLocation]);

  const handleSelectLocation = (location: Location) => {
    const displayName = location.state
      ? `${location.name}, ${location.state}, ${location.country}`
      : `${location.name}, ${location.country}`;
    
    setSearchTerm(displayName);
    setSuggestions([]);
    setShowSuggestions(false);
    onLocationSelect(location.name, location.lat, location.lon);
  };

  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white/90">Sab&apos;s Weather App</h1>
        <button
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
        >
          <MagnifyingGlassIcon className="w-6 h-6 text-white/90" />
        </button>
      </div>

      <motion.div
        initial={false}
        animate={{ height: showSuggestions ? 'auto' : 0, opacity: showSuggestions ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            placeholder="Search for any location..."
            className="w-full p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            onFocus={() => setShowSuggestions(true)}
          />
          <MagnifyingGlassIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden"
          >
            <ul className="list-none p-0">
              {suggestions.map((location, index) => (
                <li
                  key={`${location.name}-${location.lat}-${location.lon}-${index}`}
                  className="p-3 hover:bg-gray-700/50 transition-colors text-white"
                  onClick={() => handleSelectLocation(location)}
                >
                  {location.state
                    ? `${location.name}, ${location.state}, ${location.country}`
                    : `${location.name}, ${location.country}`}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}