import React, { useEffect, useRef, useState } from "react";
import { MapPin, AlertCircle, Loader2 } from "lucide-react";
import GoogleMapService from "../../services/googleMapService";
import { screensService } from "../../services/screensService";

interface SimpleMapProps {
  height?: string;
  className?: string;
}

const SimpleWorkingMap: React.FC<SimpleMapProps> = ({
  height = "500px",
  className = "",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [screens, setScreens] = useState<any[]>([]);

  const mapService = GoogleMapService.getInstance();

  useEffect(() => {
    let mounted = true;

    const initMap = async () => {
      if (!mapRef.current || !mounted) return;

      try {
        console.log("🗺️ SimpleWorkingMap: Starting initialization...");
        setIsLoading(true);
        setError(null);

        // Load Google Maps API
        console.log("🗺️ SimpleWorkingMap: Loading Google Maps API...");
        await mapService.loadGoogleMapsAPI();

        if (!mounted) return;

        // Create map
        console.log("🗺️ SimpleWorkingMap: Creating map...");
        const map = new (window as any).google.maps.Map(mapRef.current, {
          center: { lat: 28.6139, lng: 77.209 }, // Delhi center
          zoom: 6,
          mapTypeId: "roadmap",
        });

        mapInstance.current = map;

        // Load and display screens
        try {
          console.log("🗺️ SimpleWorkingMap: Loading screens...");
          const allScreens = await screensService.getAllScreens();

          if (!mounted) return;

          console.log("🗺️ SimpleWorkingMap: Loaded screens:", allScreens);
          setScreens(allScreens || []);

          // Add markers for screens with coordinates
          if (allScreens && allScreens.length > 0) {
            allScreens.forEach((screen: any, index: number) => {
              if (screen.latitude && screen.longitude) {
                const marker = new (window as any).google.maps.Marker({
                  position: {
                    lat:
                      typeof screen.latitude === "string"
                        ? parseFloat(screen.latitude)
                        : screen.latitude,
                    lng:
                      typeof screen.longitude === "string"
                        ? parseFloat(screen.longitude)
                        : screen.longitude,
                  },
                  map,
                  title: screen.name || `Screen ${index + 1}`,
                  icon: {
                    url:
                      "data:image/svg+xml;base64," +
                      btoa(`
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="#1E40AF" stroke-width="2"/>
                        <circle cx="12" cy="12" r="3" fill="white"/>
                      </svg>
                    `),
                    scaledSize: new (window as any).google.maps.Size(24, 24),
                    anchor: new (window as any).google.maps.Point(12, 12),
                  },
                });

                // Add click listener
                marker.addListener("click", () => {
                  const infoWindow = new (window as any).google.maps.InfoWindow(
                    {
                      content: `
                      <div style="padding: 10px;">
                        <h3 style="margin: 0 0 8px 0; font-weight: bold;">${
                          screen.name || "Screen"
                        }</h3>
                        <p style="margin: 0; color: #666;">${
                          screen.address || "No address provided"
                        }</p>
                        ${
                          screen.city
                            ? `<p style="margin: 4px 0 0 0; color: #666;">${screen.city}</p>`
                            : ""
                        }
                      </div>
                    `,
                    }
                  );
                  infoWindow.open(map, marker);
                });
              }
            });
          }
        } catch (screenError) {
          console.warn(
            "🗺️ SimpleWorkingMap: Could not load screens:",
            screenError
          );
          // Map still works without screens
        }

        console.log("🗺️ SimpleWorkingMap: Map initialized successfully");
        setIsLoading(false);
      } catch (error) {
        console.error("🗺️ SimpleWorkingMap: Error:", error);
        if (mounted) {
          setError(
            error instanceof Error ? error.message : "Failed to load map"
          );
          setIsLoading(false);
        }
      }
    };

    // Start initialization after a brief delay to ensure ref is ready
    const timer = setTimeout(initMap, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-red-50 border border-red-200 rounded-lg ${className}`}
        style={{ height }}
      >
        <div className="text-center p-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-700 mb-2">
            Map Loading Failed
          </h3>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${className}`}
      style={{ height }}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
            <p className="text-gray-600 text-sm">Loading map...</p>
          </div>
        </div>
      )}

      {/* Map Info */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-md px-3 py-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">
            {screens.length} Screen{screens.length !== 1 ? "s" : ""} Available
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Map Info */}
      <div className="absolute bottom-4 right-4 z-10 bg-white rounded-lg shadow-md p-3">
        <div className="text-xs text-gray-600">
          <div>🔵 Active Screens</div>
          <div className="text-gray-500 mt-1">Click markers for details</div>
        </div>
      </div>
    </div>
  );
};

export default SimpleWorkingMap;
