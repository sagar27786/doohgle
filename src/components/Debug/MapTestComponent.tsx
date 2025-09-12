import React, { useEffect, useRef, useState } from "react";
import GoogleMapService from "../../services/googleMapService";

const MapTestComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("Loading...");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const testGoogleMaps = async () => {
      try {
        // Check environment variables
        const envApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        setApiKey(envApiKey || "Not found in environment");

        setStatus("Loading Google Maps API...");

        const mapService = GoogleMapService.getInstance();
        await mapService.loadGoogleMapsAPI();

        setStatus("Google Maps API loaded successfully");

        if (mapRef.current) {
          const map = new (window as any).google.maps.Map(mapRef.current, {
            center: { lat: 28.6139, lng: 77.209 }, // Delhi
            zoom: 10,
          });
          setStatus("Map created successfully");
        }
      } catch (error) {
        console.error("Google Maps test error:", error);
        setStatus(
          `Error: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    };

    testGoogleMaps();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold mb-4">Google Maps Test</h2>
      <div className="space-y-3">
        <div>
          <strong>Status:</strong> <span className="ml-2">{status}</span>
        </div>
        <div>
          <strong>API Key:</strong>
          <span className="ml-2 font-mono text-sm">
            {apiKey ? `${apiKey.substring(0, 20)}...` : "Not loaded"}
          </span>
        </div>
        <div>
          <strong>Google Maps Available:</strong>
          <span className="ml-2">
            {(window as any).google?.maps ? "✅ Yes" : "❌ No"}
          </span>
        </div>
      </div>
      <div
        ref={mapRef}
        className="w-full h-64 bg-gray-200 rounded border mt-4"
        style={{ minHeight: "250px" }}
      >
        <div className="flex items-center justify-center h-full text-gray-600">
          Map will load here...
        </div>
      </div>
    </div>
  );
};

export default MapTestComponent;
