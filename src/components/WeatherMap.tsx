'use client';

import { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';

interface WeatherMapProps {
  lat: number;
  lon: number;
  cityName?: string; // Made optional
}

export default function WeatherMap({ lat, lon, cityName = '' }: WeatherMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const [showPrecipitation, setShowPrecipitation] = useState(true);
  const [showClouds, setShowClouds] = useState(false);
  const [showTemperature, setShowTemperature] = useState(false);
  const [showWind, setShowWind] = useState(false);
  
  // References to keep track of the layers
  const precipitationLayerRef = useRef<TileLayer<XYZ> | null>(null);
  const cloudsLayerRef = useRef<TileLayer<XYZ> | null>(null);
  const tempLayerRef = useRef<TileLayer<XYZ> | null>(null);
  const windLayerRef = useRef<TileLayer<XYZ> | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create OpenLayers map if it doesn't exist yet
    if (!map.current) {
      // Base layers
      const osmLayer = new TileLayer({
        source: new OSM(),
        visible: true,
        zIndex: 0
      });

      // Create the map
      map.current = new Map({
        target: mapRef.current,
        layers: [osmLayer],
        view: new View({
          center: fromLonLat([lon, lat]),
          zoom: 7
        }),
        controls: []
      });

      // Create weather layers
      const precipitationLayer = new TileLayer({
        source: new XYZ({
          url: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`,
          attributions: '© OpenWeatherMap'
        }),
        visible: showPrecipitation,
        zIndex: 1
      });
      precipitationLayerRef.current = precipitationLayer;

      const cloudsLayer = new TileLayer({
        source: new XYZ({
          url: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`,
          attributions: '© OpenWeatherMap'
        }),
        visible: showClouds,
        zIndex: 1
      });
      cloudsLayerRef.current = cloudsLayer;

      const tempLayer = new TileLayer({
        source: new XYZ({
          url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`,
          attributions: '© OpenWeatherMap'
        }),
        visible: showTemperature,
        zIndex: 1
      });
      tempLayerRef.current = tempLayer;

      const windLayer = new TileLayer({
        source: new XYZ({
          url: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`,
          attributions: '© OpenWeatherMap'
        }),
        visible: showWind,
        zIndex: 1
      });
      windLayerRef.current = windLayer;

      // Add weather layers to map
      map.current.addLayer(precipitationLayer);
      map.current.addLayer(cloudsLayer);
      map.current.addLayer(tempLayer);
      map.current.addLayer(windLayer);
    }

    // Update map view when coordinates change
    if (map.current) {
      map.current.getView().setCenter(fromLonLat([lon, lat]));
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.setTarget(undefined);
        map.current = null;
      }
    };
  }, [lat, lon, showPrecipitation, showClouds, showTemperature, showWind]);

  // Update layer visibility when toggles change
  useEffect(() => {
    if (precipitationLayerRef.current) {
      precipitationLayerRef.current.setVisible(showPrecipitation);
    }
    if (cloudsLayerRef.current) {
      cloudsLayerRef.current.setVisible(showClouds);
    }
    if (tempLayerRef.current) {
      tempLayerRef.current.setVisible(showTemperature);
    }
    if (windLayerRef.current) {
      windLayerRef.current.setVisible(showWind);
    }
  }, [showPrecipitation, showClouds, showTemperature, showWind]);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Weather Map{cityName && ` - ${cityName}`}</h2>
      <div className="relative">
        <div 
          ref={mapRef} 
          className="w-full h-[300px] rounded-xl overflow-hidden"
        />
        <div className="absolute top-2 right-2 bg-gray-800/80 backdrop-blur-sm p-2 rounded-lg flex flex-wrap gap-2 z-10">
          <button
            onClick={() => setShowPrecipitation(!showPrecipitation)}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              showPrecipitation 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Precipitation
          </button>
          <button
            onClick={() => setShowClouds(!showClouds)}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              showClouds 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Clouds
          </button>
          <button
            onClick={() => setShowTemperature(!showTemperature)}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              showTemperature 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Temperature
          </button>
          <button
            onClick={() => setShowWind(!showWind)}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              showWind 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Wind
          </button>
        </div>
      </div>
    </div>
  );
} 