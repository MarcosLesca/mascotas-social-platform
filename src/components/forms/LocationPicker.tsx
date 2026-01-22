"use client";

import { useState, useEffect } from "react";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Location } from "@/types";

interface LocationPickerProps {
  location: Location;
  onChange: (location: Location) => void;
  error?: string;
}

export function LocationPicker({ location, onChange, error }: LocationPickerProps) {
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  // San Justo, Santa Fe, Argentina - Localidades cercanas
  const localities = [
    "San Justo",
    "San Martín Norte",
    "Villa Minetti",
    "Fray Luis Beltrán",
    "Colonia Ana",
    "Fraga",
    "Pedro Gómez Cello",
    "Angel Gallardo",
    "Logroño",
    "Nora",
    "Plaza Clucellas",
    "Vila",
    "Álvarez",
    "Santo Domingo",
    "Elortondo",
    "Ceres",
    "Las Garzas",
    "Moisés Ville",
    "La Camila",
    "Castellanos",
  ];

  // Coordenadas de San Justo, Santa Fe, Argentina
  const defaultCoords = { lat: -30.784, lng: -62.593 };

  const getCurrentLocation = () => {
    setGettingLocation(true);
    
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización");
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Obtener dirección usando OpenStreetMap Nominatim (gratuito)
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=es`
          );
          const data = await response.json();
          
          const address = data.display_name || "Ubicación desconocida";
          const city = data.address?.town || data.address?.village || data.address?.city || "San Justo";
          const department = data.address?.state || "Santa Fe";
          
          onChange({
            latitude,
            longitude,
            address,
            city,
            department,
          });
        } catch (error) {
          console.error("Error getting address:", error);
          onChange({
            latitude,
            longitude,
            address: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`,
            city: "San Justo",
            department: "Santa Fe",
          });
        }
        
        setGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("No se pudo obtener tu ubicación. Por favor, ingrésala manualmente.");
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleDepartmentChange = (department: string) => {
    onChange({
      ...location,
      department,
    });
  };

  const handleCityChange = (city: string) => {
    onChange({
      ...location,
      city,
    });
  };

  const handleAddressChange = (address: string) => {
    onChange({
      ...location,
      address,
    });
  };

  // Componente Mapa simple
  const SimpleMap = () => {
    useEffect(() => {
      // Dynamic import para evitar SSR issues
      const initMap = async () => {
        if (typeof window === 'undefined') return;

        try {
          const L = await import('leaflet');
          
          // Fix para iconos por defecto de Leaflet
          delete (L.Icon.Default.prototype as any)._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          });

          const coords = location.latitude !== 0 && location.longitude !== 0 
            ? [location.latitude, location.longitude] 
            : [defaultCoords.lat, defaultCoords.lng];

          // Si ya existe un mapa, lo destruimos
          const existingMap = (window as any).__map;
          if (existingMap) {
            existingMap.remove();
          }

          const map = L.map('map').setView(coords as [number, number], 13);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          const marker = L.marker(coords as [number, number]).addTo(map);

          // Actualizar marker al hacer clic
          map.on('click', (e: any) => {
            const { lat, lng } = e.latlng;
            marker.setLatLng([lat, lng]);
            
            onChange({
              ...location,
              latitude: lat,
              longitude: lng,
              address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`,
            });
          });

          (window as any).__map = map;
        } catch (error) {
          console.error('Error loading map:', error);
        }
      };

      initMap();

      return () => {
        // Cleanup
        const existingMap = (window as any).__map;
        if (existingMap) {
          existingMap.remove();
          delete (window as any).__map;
        }
      };
    }, [location.latitude, location.longitude, mapKey]);

    return (
      <div 
        id="map" 
        className="w-full h-64 rounded-lg border border-gray-300"
        style={{ zIndex: 1 }}
      />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <MapPin className="h-5 w-5 text-gray-500" />
        <h3 className="text-lg font-semibold">Ubicación</h3>
      </div>

      {/* Mapa */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          🗺️ Seleccioná la ubicación en el mapa
        </label>
        <SimpleMap />
        <p className="text-xs text-gray-500">
          Hacé clic en el mapa para ajustar la ubicación exacta
        </p>
      </div>

      <button
        type="button"
        onClick={getCurrentLocation}
        disabled={gettingLocation}
        className={cn(
          "flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors",
          gettingLocation && "opacity-50 cursor-not-allowed"
        )}
      >
        {gettingLocation ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Navigation className="h-4 w-4" />
        )}
        <span>{gettingLocation ? "Obteniendo ubicación..." : "Usar mi ubicación actual (GPS)"}</span>
      </button>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Localidad *
          </label>
          <select
            value={location.city}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Seleccionar localidad...</option>
            {localities.map((locality) => (
              <option key={locality} value={locality}>
                {locality}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Barrio / Zona (opcional)
          </label>
          <input
            type="text"
            value={location.department || ''}
            onChange={(e) => handleDepartmentChange(e.target.value)}
            placeholder="Ej: Centro, Norte, Barrio Sur"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Calle y número o referencia *
        </label>
        <textarea
          value={location.address}
          onChange={(e) => handleAddressChange(e.target.value)}
          placeholder="Ej: Mitre 1234, esquina San Martín, frente a la plaza"
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {location.latitude !== 0 && location.longitude !== 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Coordenadas:</strong> {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="text-sm text-gray-500">
        <p>💡 Usa "Usar mi ubicación actual" para obtener coordenadas precisas o selecciona tu localidad.</p>
        <p>Esta información ayudará a que encuentren a tu mascota más fácilmente en San Justo y alrededores.</p>
      </div>
    </div>
  );
}