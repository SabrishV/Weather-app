import { motion } from 'framer-motion';
import { WiDaySunny, WiRain, WiSnow, WiThunderstorm, WiCloudy, WiFog } from 'react-icons/wi';

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

interface ForecastProps {
  forecast: ForecastItem[];
  isCelsius: boolean;
}

export default function WeatherForecast({ forecast, isCelsius }: ForecastProps) {
  // Get the appropriate weather icon
  const getWeatherIcon = (weatherCode: number) => {
    if (weatherCode >= 200 && weatherCode < 300) return <WiThunderstorm className="w-10 h-10 text-purple-400" />;
    if (weatherCode >= 300 && weatherCode < 400) return <WiRain className="w-10 h-10 text-blue-400" />;
    if (weatherCode >= 500 && weatherCode < 600) return <WiRain className="w-10 h-10 text-blue-500" />;
    if (weatherCode >= 600 && weatherCode < 700) return <WiSnow className="w-10 h-10 text-blue-200" />;
    if (weatherCode >= 700 && weatherCode < 800) return <WiFog className="w-10 h-10 text-gray-400" />;
    if (weatherCode === 800) return <WiDaySunny className="w-10 h-10 text-yellow-400" />;
    return <WiCloudy className="w-10 h-10 text-gray-400" />;
  };

  // Format temperature based on selected unit
  const formatTemp = (temp: number) => {
    if (isCelsius) {
      return `${Math.round(temp)}°C`;
    }
    return `${Math.round((temp * 9/5) + 32)}°F`;
  };

  // Format day from timestamp
  const formatDay = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">5-Day Forecast</h2>
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden">
        <div className="grid grid-cols-5 divide-x divide-gray-700">
          {forecast.map((day, index) => (
            <motion.div
              key={day.dt}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="p-4 text-center"
            >
              <p className="text-gray-400 mb-2">{formatDay(day.dt)}</p>
              <div className="flex justify-center mb-2">
                {getWeatherIcon(day.weather[0].id)}
              </div>
              <p className="text-lg font-semibold">{formatTemp(day.main.temp)}</p>
              <p className="text-xs text-gray-400 mt-1 capitalize">{day.weather[0].description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 