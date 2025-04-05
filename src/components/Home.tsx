import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WeatherEffects from './WeatherEffects';
import SearchBar from './SearchBar';
import WeatherDisplay from './WeatherDisplay';

// Define interfaces for API responses
interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  coord: {
    lat: number;
    lon: number;
  };
  timezone: number;
  dt: number;
}

interface ForecastData {
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    dt_txt: string;
  }[];
  city: {
    name: string;
    country: string;
    timezone: number;
  };
}

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [timeLoaded, setTimeLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_WEATHER_API_KEY) {
      setError('Weather API key is not configured. Please check your .env.local file.');
      console.error('Weather API key is missing');
    }

    // Update time every second
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      setTimeLoaded(true);
    };

    // Initial update
    updateTime();

    // Update every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const searchLocation = (selectedCity: string, lat?: number, lon?: number) => {
    setLoading(true);
    setError('');
    
    if (!process.env.NEXT_PUBLIC_WEATHER_API_KEY) {
      setError("API key is missing. Please check your environment variables.");
      setLoading(false);
      return;
    }

    // Fetch current weather data
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?${lat && lon ? `lat=${lat}&lon=${lon}` : `q=${selectedCity}`}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric`
    )
    .then(response => {
      if (!response.ok) {
        throw new Error("Couldn&apos;t fetch weather data");
      }
      return response.json();
    })
    .then((data: WeatherData) => {
      setWeatherData(data);
      
      // Fetch 5-day forecast
      return fetch(
        `https://api.openweathermap.org/data/2.5/forecast?${lat && lon ? `lat=${lat}&lon=${lon}` : `q=${selectedCity}`}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric`
      );
    })
    .then(response => {
      if (!response || !response.ok) {
        throw new Error("Couldn&apos;t fetch forecast data");
      }
      return response.json();
    })
    .then((data: ForecastData) => {
      setForecastData(data);
      setLoading(false);
    })
    .catch((err: Error) => {
      setError(err.message);
      setLoading(false);
    });
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4 relative">
      {/* Weather Effects Background */}
      {weatherData && (
        <WeatherEffects 
          weather={weatherData.weather[0].main}
          description={weatherData.weather[0].description}
        />
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto relative z-10">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-500/20 backdrop-blur-sm rounded-lg text-red-300"
          >
            {error}
          </motion.div>
        )}

        <SearchBar 
          onLocationSelect={(name, lat, lon) => searchLocation(name, lat, lon)}
          onError={setError}
        />

        {!weatherData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 text-center"
          >
            <h1 className="text-4xl font-bold text-white/90 mb-4">
              Sabrish&apos;s Weather App
            </h1>
            <p className="text-xl text-white/70 mb-8">
              Search for any location to get real-time weather information
            </p>
            {timeLoaded && (
              <div className="text-center mb-8 animate-fade-in">
                <div className="text-7xl font-bold mb-2">
                  {currentTime.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  })}
                </div>
                <div className="text-xl text-gray-300">
                  {currentTime.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {weatherData && (
          <WeatherDisplay
            weather={weatherData}
            forecast={forecastData?.list.filter((_, index: number) => index % 8 === 0) || []}
            isCelsius={true}
            onToggleUnit={() => {}}
          />
        )}

        {loading && (
          <div className="mt-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/90 mx-auto"></div>
          </div>
        )}
      </div>
    </main>
  );
} 