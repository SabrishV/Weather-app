import { motion } from 'framer-motion';
import { WiSunrise, WiSunset, WiThermometer, WiStrongWind, WiHumidity, WiBarometer } from 'react-icons/wi';

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_min?: number;
    temp_max?: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
  timezone: number;
}

interface WeatherDetailsProps {
  weather: WeatherData;
  isCelsius: boolean;
  onToggleUnit: () => void;
}

export default function WeatherDetails({ weather, isCelsius, onToggleUnit }: WeatherDetailsProps) {
  const convertTemp = (temp: number) => {
    if (!isCelsius) {
      return ((temp * 9/5) + 32).toFixed(1) + '°F';
    }
    return temp.toFixed(1) + '°C';
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getWindDirection = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  const formatTimeWithTimezone = (timestamp: number, timezone: number) => {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Additional Details</h2>
        <button
          onClick={onToggleUnit}
          className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          {isCelsius ? '°C' : '°F'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-700 p-4 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <WiSunrise className="w-6 h-6" />
            <p className="text-gray-400">Sunrise</p>
          </div>
          <p className="text-2xl font-bold">{formatTime(weather.sys.sunrise)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-700 p-4 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <WiSunset className="w-6 h-6" />
            <p className="text-gray-400">Sunset</p>
          </div>
          <p className="text-2xl font-bold">{formatTime(weather.sys.sunset)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-700 p-4 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <WiThermometer className="w-6 h-6" />
            <p className="text-gray-400">Min/Max</p>
          </div>
          <p className="text-2xl font-bold">
            {convertTemp(weather.main.temp_min || weather.main.temp)} / {convertTemp(weather.main.temp_max || weather.main.temp)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-700 p-4 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <WiStrongWind className="w-6 h-6" />
            <p className="text-gray-400">Wind Gust</p>
          </div>
          <p className="text-2xl font-bold">{weather.wind.gust || 0} m/s</p>
        </motion.div>

        <div className="flex items-center">
          <WiHumidity className="text-4xl text-blue-400 mr-2" />
          <div>
            <p className="text-gray-400">Humidity</p>
            <p className="text-xl">{weather.main.humidity}%</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <WiBarometer className="text-4xl text-blue-400 mr-2" />
          <div>
            <p className="text-gray-400">Pressure</p>
            <p className="text-xl">{weather.main.pressure} hPa</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <WiStrongWind className="text-4xl text-blue-400 mr-2" />
          <div>
            <p className="text-gray-400">Wind</p>
            <p className="text-xl">
              {weather.wind.speed} m/s {getWindDirection(weather.wind.deg)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="flex">
            <WiSunrise className="text-4xl text-yellow-400 mr-1" />
            <WiSunset className="text-4xl text-orange-400" />
          </div>
          <div>
            <p className="text-gray-400">Sun</p>
            <p className="text-sm">
              {formatTimeWithTimezone(weather.sys.sunrise, weather.timezone)} / {formatTimeWithTimezone(weather.sys.sunset, weather.timezone)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 