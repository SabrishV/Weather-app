import { motion } from 'framer-motion';
import { WiDaySunny, WiRain, WiSnow, WiThunderstorm, WiCloudy, WiDust, WiFog } from 'react-icons/wi';
import WeatherDetails from './WeatherDetails';
import WeatherForecast from './WeatherForecast';
import WeatherMap from './WeatherMap';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_min?: number;
    temp_max?: number;
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
    gust?: number;
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

interface ForecastItem {
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
}

interface WeatherDisplayProps {
  weather: WeatherData;
  forecast: ForecastItem[];
  isCelsius: boolean;
  onToggleUnit: () => void;
}

export default function WeatherDisplay({ weather, forecast, isCelsius, onToggleUnit }: WeatherDisplayProps) {
  // Get the appropriate weather icon
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <WiDaySunny className="text-6xl text-yellow-400" />;
      case 'rain':
      case 'drizzle':
        return <WiRain className="text-6xl text-blue-400" />;
      case 'snow':
        return <WiSnow className="text-6xl text-blue-200" />;
      case 'thunderstorm':
        return <WiThunderstorm className="text-6xl text-purple-400" />;
      case 'clouds':
        return <WiCloudy className="text-6xl text-gray-400" />;
      case 'dust':
      case 'sand':
      case 'ash':
        return <WiDust className="text-6xl text-yellow-600" />;
      case 'fog':
      case 'mist':
      case 'haze':
        return <WiFog className="text-6xl text-gray-300" />;
      default:
        return <WiDaySunny className="text-6xl text-yellow-400" />;
    }
  };

  // Format temperature
  const formatTemp = (temp: number) => {
    if (isCelsius) {
      return `${Math.round(temp)}°C`;
    }
    return `${Math.round((temp * 9/5) + 32)}°F`;
  };

  // Format date with timezone offset
  const formatLocalTime = (timestamp: number, timezone: number) => {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center items-center mb-4"
        >
          {getWeatherIcon(weather.weather[0].main)}
        </motion.div>
        
        <h1 className="text-4xl font-bold text-white mb-1">{weather.name}, {weather.sys.country}</h1>
        <p className="text-gray-300 mb-4">{formatLocalTime(weather.dt, weather.timezone)}</p>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <div className="text-center">
            <p className="text-6xl font-bold text-white">
              {formatTemp(weather.main.temp)}
            </p>
            <button
              onClick={onToggleUnit}
              className="mt-2 px-3 py-1 bg-blue-600/30 hover:bg-blue-600/50 rounded-full text-sm transition-colors"
            >
              Switch to {isCelsius ? '°F' : '°C'}
            </button>
          </div>
          
          <div className="text-center md:text-left md:border-l md:border-gray-600 md:pl-4">
            <p className="text-xl capitalize mb-1">{weather.weather[0].description}</p>
            <p className="text-gray-400">Feels like {formatTemp(weather.main.feels_like)}</p>
          </div>
        </div>
      </div>
      
      <WeatherMap lat={weather.coord.lat} lon={weather.coord.lon} />
      
      <WeatherDetails 
        weather={weather} 
        isCelsius={isCelsius}
        onToggleUnit={onToggleUnit}
      />
      
      <WeatherForecast forecast={forecast} isCelsius={isCelsius} />
    </motion.div>
  );
} 