import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface WeatherEffectsProps {
  weather: string;
  description: string;
}

export default function WeatherEffects({ weather }: WeatherEffectsProps) {
  const getWeatherEmojis = (weather: string) => {
    const weatherLower = weather.toLowerCase();
    if (weatherLower.includes('clear')) return ['☀️', '😎', '🌄'];
    if (weatherLower.includes('cloud')) return ['☁️', '⛅', '🌥️'];
    if (weatherLower.includes('rain')) return ['🌧️', '🌦️', '☔', '💧'];
    if (weatherLower.includes('thunder')) return ['⛈️', '⚡', '🌩️'];
    if (weatherLower.includes('snow')) return ['❄️', '☃️', '🌨️'];
    if (weatherLower.includes('fog') || weatherLower.includes('mist')) return ['🌫️', '😶‍🌫️'];
    if (weatherLower.includes('haze')) return ['🌫️', '🔥'];
    return ['☀️', '🌍', '✨'];
  };

  // Use useMemo to prevent re-creation of emojis on each render
  const backgroundEmojis = useMemo(() => {
    const emojis = getWeatherEmojis(weather);
    
    return Array.from({ length: 20 }, (_, index) => {
      // Use deterministic values based on index to prevent random changes
      const seed = index * 0.1;
      const seed2 = index * 0.2;
      
      // Use deterministic pseudo-random values
      const x = ((index * 83) % 100); // Distribute evenly across width
      const y = ((index * 47) % 100); // Distribute evenly across height
      
      // Size should be consistent for an emoji
      const size = 1.5 + (seed % 1);
      
      // Control points for Bezier curves
      const amplitudeX = 30 + (seed2 * 20);
      const amplitudeY = 20 + (seed2 * 15);
      
      // Use different durations for varied movement
      const duration = 20 + (index % 10) * 5;
      
      // Different delays to prevent synchronized movement
      const delay = index * 0.5;
      
      return {
        emoji: emojis[index % emojis.length],
        id: index,
        x,
        y,
        size,
        amplitudeX,
        amplitudeY,
        duration,
        delay,
      };
    });
  }, [weather]); // Only recalculate when weather changes

  return (
    <motion.div 
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900/90" 
        animate={{
          opacity: [0.8, 0.9, 0.8],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
      
      {/* Background emojis */}
      {backgroundEmojis.map((bgEmoji) => (
        <motion.div
          key={bgEmoji.id}
          className="absolute"
          style={{
            left: `${bgEmoji.x}%`,
            top: `${bgEmoji.y}%`,
            fontSize: `${bgEmoji.size}rem`,
          }}
          animate={{
            x: [
              0,
              bgEmoji.amplitudeX * 0.25,
              bgEmoji.amplitudeX * 0.5,
              bgEmoji.amplitudeX * 0.75,
              bgEmoji.amplitudeX,
              bgEmoji.amplitudeX * 0.75,
              bgEmoji.amplitudeX * 0.5,
              bgEmoji.amplitudeX * 0.25,
              0,
              -bgEmoji.amplitudeX * 0.25,
              -bgEmoji.amplitudeX * 0.5,
              -bgEmoji.amplitudeX * 0.75,
              -bgEmoji.amplitudeX,
              -bgEmoji.amplitudeX * 0.75,
              -bgEmoji.amplitudeX * 0.5,
              -bgEmoji.amplitudeX * 0.25,
              0
            ],
            y: [
              0,
              bgEmoji.amplitudeY * 0.5,
              bgEmoji.amplitudeY,
              bgEmoji.amplitudeY * 0.5,
              0,
              -bgEmoji.amplitudeY * 0.5,
              -bgEmoji.amplitudeY,
              -bgEmoji.amplitudeY * 0.5,
              0
            ],
            rotate: [0, 10, 0, -10, 0],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: bgEmoji.duration,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: bgEmoji.delay,
          }}
        >
          {bgEmoji.emoji}
        </motion.div>
      ))}
      
      {/* Weather-specific overlays */}
      {weather.toLowerCase().includes('rain') && (
        <motion.div
          className="absolute inset-0 bg-blue-500/10"
          animate={{ opacity: [0, 0.2, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
      
      {weather.toLowerCase().includes('snow') && (
        <motion.div
          className="absolute inset-0 bg-blue-100/10"
          animate={{ opacity: [0, 0.2, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
      
      {weather.toLowerCase().includes('thunder') && (
        <motion.div
          className="absolute inset-0 bg-yellow-500/10"
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 4,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.div>
  );
}
