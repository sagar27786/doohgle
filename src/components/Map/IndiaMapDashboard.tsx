import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  TrendingUp,
  Users,
  DollarSign,
  Monitor,
  Play,
  Eye,
  X,
  BarChart3,
} from "lucide-react";

interface CityData {
  id: string;
  name: string;
  state: string;
  coordinates: { x: number; y: number }; // SVG coordinates
  stats: {
    totalScreens: number;
    activeScreens: number;
    totalImpressions: number;
    revenue: number;
    activeCampaigns: number;
    averageRate: number;
  };
  popularAreas: string[];
  growth: number; // percentage
}

const IndiaMapDashboard: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  // Indian cities data with approximate SVG coordinates
  const citiesData: CityData[] = [
    {
      id: "mumbai",
      name: "Mumbai",
      state: "Maharashtra",
      coordinates: { x: 180, y: 280 },
      stats: {
        totalScreens: 347,
        activeScreens: 289,
        totalImpressions: 2450000,
        revenue: 8900000,
        activeCampaigns: 156,
        averageRate: 750,
      },
      popularAreas: ["Andheri", "Bandra", "Lower Parel", "BKC", "Powai"],
      growth: 15.4,
    },
    {
      id: "delhi",
      name: "Delhi",
      state: "Delhi",
      coordinates: { x: 220, y: 180 },
      stats: {
        totalScreens: 298,
        activeScreens: 234,
        totalImpressions: 1980000,
        revenue: 7200000,
        activeCampaigns: 123,
        averageRate: 650,
      },
      popularAreas: ["CP", "Gurgaon", "Noida", "Karol Bagh", "Lajpat Nagar"],
      growth: 12.8,
    },
    {
      id: "bangalore",
      name: "Bangalore",
      state: "Karnataka",
      coordinates: { x: 220, y: 350 },
      stats: {
        totalScreens: 234,
        activeScreens: 198,
        totalImpressions: 1560000,
        revenue: 5800000,
        activeCampaigns: 89,
        averageRate: 550,
      },
      popularAreas: [
        "Koramangala",
        "Whitefield",
        "Electronic City",
        "MG Road",
        "Indiranagar",
      ],
      growth: 18.2,
    },
    {
      id: "pune",
      name: "Pune",
      state: "Maharashtra",
      coordinates: { x: 190, y: 310 },
      stats: {
        totalScreens: 156,
        activeScreens: 134,
        totalImpressions: 890000,
        revenue: 3200000,
        activeCampaigns: 67,
        averageRate: 450,
      },
      popularAreas: ["FC Road", "Baner", "Hinjewadi", "Koregaon Park", "Wakad"],
      growth: 22.1,
    },
    {
      id: "hyderabad",
      name: "Hyderabad",
      state: "Telangana",
      coordinates: { x: 230, y: 320 },
      stats: {
        totalScreens: 187,
        activeScreens: 156,
        totalImpressions: 1120000,
        revenue: 4100000,
        activeCampaigns: 78,
        averageRate: 480,
      },
      popularAreas: [
        "Hitech City",
        "Gachibowli",
        "Jubilee Hills",
        "Banjara Hills",
        "Kukatpally",
      ],
      growth: 16.7,
    },
    {
      id: "chennai",
      name: "Chennai",
      state: "Tamil Nadu",
      coordinates: { x: 230, y: 380 },
      stats: {
        totalScreens: 167,
        activeScreens: 142,
        totalImpressions: 980000,
        revenue: 3600000,
        activeCampaigns: 65,
        averageRate: 420,
      },
      popularAreas: ["T. Nagar", "Anna Nagar", "Velachery", "OMR", "Adyar"],
      growth: 14.3,
    },
    {
      id: "kolkata",
      name: "Kolkata",
      state: "West Bengal",
      coordinates: { x: 280, y: 240 },
      stats: {
        totalScreens: 134,
        activeScreens: 112,
        totalImpressions: 760000,
        revenue: 2800000,
        activeCampaigns: 52,
        averageRate: 380,
      },
      popularAreas: [
        "Salt Lake",
        "Park Street",
        "Ballygunge",
        "New Town",
        "Rajarhat",
      ],
      growth: 11.2,
    },
    {
      id: "ahmedabad",
      name: "Ahmedabad",
      state: "Gujarat",
      coordinates: { x: 170, y: 230 },
      stats: {
        totalScreens: 112,
        activeScreens: 94,
        totalImpressions: 620000,
        revenue: 2200000,
        activeCampaigns: 43,
        averageRate: 340,
      },
      popularAreas: [
        "SG Highway",
        "CG Road",
        "Satellite",
        "Bodakdev",
        "Prahlad Nagar",
      ],
      growth: 19.5,
    },
  ];

  // Simple India map SVG
  const IndiaMapSVG = () => (
    <svg viewBox="0 0 400 450" className="w-full h-full">
      {/* Simplified India outline */}
      <path
        d="M 150 150 Q 180 140 220 150 Q 280 140 320 160 Q 340 180 350 220 Q 360 260 350 300 Q 340 340 320 360 Q 300 380 280 390 Q 260 400 240 390 Q 220 400 200 390 Q 180 380 160 370 Q 140 350 130 320 Q 120 280 130 240 Q 140 200 150 150 Z"
        fill="#f0f9ff"
        stroke="#93c5fd"
        strokeWidth="2"
        className="drop-shadow-sm"
      />

      {/* City markers */}
      {citiesData.map((city) => {
        const isHovered = hoveredCity === city.id;
        const isSelected = selectedCity?.id === city.id;

        return (
          <g key={city.id}>
            {/* Pulsing effect for active cities */}
            {(isHovered || isSelected) && (
              <circle
                cx={city.coordinates.x}
                cy={city.coordinates.y}
                r="15"
                fill="rgba(59, 130, 246, 0.3)"
                className="animate-ping"
              />
            )}

            {/* City marker */}
            <motion.circle
              cx={city.coordinates.x}
              cy={city.coordinates.y}
              r={isSelected ? "8" : isHovered ? "6" : "4"}
              fill={isSelected ? "#dc2626" : "#3b82f6"}
              stroke="white"
              strokeWidth="2"
              className="cursor-pointer drop-shadow-sm"
              whileHover={{ scale: 1.5 }}
              onMouseEnter={() => setHoveredCity(city.id)}
              onMouseLeave={() => setHoveredCity(null)}
              onClick={() => setSelectedCity(city)}
            />

            {/* City label */}
            <text
              x={city.coordinates.x}
              y={city.coordinates.y - 12}
              textAnchor="middle"
              className="text-xs font-medium fill-gray-700 pointer-events-none"
            >
              {city.name}
            </text>

            {/* Hover tooltip */}
            {isHovered && !isSelected && (
              <g>
                <rect
                  x={city.coordinates.x - 60}
                  y={city.coordinates.y + 15}
                  width="120"
                  height="60"
                  fill="white"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  rx="4"
                  className="drop-shadow-lg"
                />
                <text
                  x={city.coordinates.x}
                  y={city.coordinates.y + 30}
                  textAnchor="middle"
                  className="text-xs font-semibold fill-gray-900"
                >
                  {city.name}
                </text>
                <text
                  x={city.coordinates.x}
                  y={city.coordinates.y + 45}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                >
                  {city.stats.totalScreens} screens
                </text>
                <text
                  x={city.coordinates.x}
                  y={city.coordinates.y + 58}
                  textAnchor="middle"
                  className="text-xs fill-green-600 font-medium"
                >
                  ₹{(city.stats.revenue / 100000).toFixed(1)}L
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            India DOOH Network
          </h1>
          <p className="text-gray-600">
            Interactive map showing digital screen locations and performance
            across India
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Interactive Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Live Network Map
                </h2>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-gray-600">Active Cities</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-gray-600">Selected</span>
                  </div>
                </div>
              </div>

              <div className="h-96 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
                <IndiaMapSVG />
              </div>

              <div className="mt-4 text-center text-sm text-gray-600">
                Click on any city to view detailed statistics and analytics
              </div>
            </div>
          </div>

          {/* City Details Panel */}
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Network Overview
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Cities</span>
                  <span className="font-bold text-gray-900">
                    {citiesData.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Screens</span>
                  <span className="font-bold text-blue-600">
                    {citiesData.reduce(
                      (sum, city) => sum + city.stats.totalScreens,
                      0
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Screens</span>
                  <span className="font-bold text-green-600">
                    {citiesData.reduce(
                      (sum, city) => sum + city.stats.activeScreens,
                      0
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Monthly Revenue</span>
                  <span className="font-bold text-purple-600">
                    ₹
                    {(
                      citiesData.reduce(
                        (sum, city) => sum + city.stats.revenue,
                        0
                      ) / 100000
                    ).toFixed(1)}
                    L
                  </span>
                </div>
              </div>
            </div>

            {/* Top Performing Cities */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top Performing Cities
              </h3>
              <div className="space-y-3">
                {citiesData
                  .sort((a, b) => b.stats.revenue - a.stats.revenue)
                  .slice(0, 5)
                  .map((city, index) => (
                    <div
                      key={city.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                      onClick={() => setSelectedCity(city)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-600">
                            #{index + 1}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {city.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {city.stats.totalScreens} screens
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-600">
                          ₹{(city.stats.revenue / 100000).toFixed(1)}L
                        </div>
                        <div className="text-xs text-gray-600">
                          {city.growth > 0 ? "↗" : "↘"} {Math.abs(city.growth)}%
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Selected City Details Modal */}
        <AnimatePresence>
          {selectedCity && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedCity(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedCity.name}
                      </h2>
                      <p className="text-gray-600">{selectedCity.state}</p>
                    </div>
                    <button
                      onClick={() => setSelectedCity(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-600">
                            Total Screens
                          </p>
                          <p className="text-2xl font-bold text-blue-900">
                            {selectedCity.stats.totalScreens}
                          </p>
                        </div>
                        <Monitor className="text-blue-600" size={24} />
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-600">
                            Active Screens
                          </p>
                          <p className="text-2xl font-bold text-green-900">
                            {selectedCity.stats.activeScreens}
                          </p>
                        </div>
                        <Play className="text-green-600" size={24} />
                      </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-600">
                            Impressions
                          </p>
                          <p className="text-2xl font-bold text-purple-900">
                            {(
                              selectedCity.stats.totalImpressions / 1000000
                            ).toFixed(1)}
                            M
                          </p>
                        </div>
                        <Eye className="text-purple-600" size={24} />
                      </div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-orange-600">
                            Revenue
                          </p>
                          <p className="text-2xl font-bold text-orange-900">
                            ₹{(selectedCity.stats.revenue / 100000).toFixed(1)}L
                          </p>
                        </div>
                        <DollarSign className="text-orange-600" size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Popular Areas */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Popular Areas
                      </h3>
                      <div className="space-y-2">
                        {selectedCity.popularAreas.map((area, index) => (
                          <div
                            key={area}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <MapPin size={12} className="text-blue-600" />
                              </div>
                              <span className="font-medium">{area}</span>
                            </div>
                            <span className="text-sm text-gray-600">
                              {Math.floor(Math.random() * 50) + 10} screens
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Performance Stats */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Performance Stats
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">
                            Active Campaigns
                          </span>
                          <span className="font-bold text-gray-900">
                            {selectedCity.stats.activeCampaigns}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Average Rate</span>
                          <span className="font-bold text-gray-900">
                            ₹{selectedCity.stats.averageRate}/day
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Growth Rate</span>
                          <span
                            className={`font-bold ${
                              selectedCity.growth >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {selectedCity.growth >= 0 ? "↗" : "↘"}{" "}
                            {Math.abs(selectedCity.growth)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">
                            Utilization Rate
                          </span>
                          <span className="font-bold text-gray-900">
                            {Math.round(
                              (selectedCity.stats.activeScreens /
                                selectedCity.stats.totalScreens) *
                                100
                            )}
                            %
                          </span>
                        </div>
                      </div>

                      {/* Performance Chart */}
                      <div className="mt-6">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Monthly Performance
                        </h4>
                        <div className="h-32 flex items-end justify-between space-x-1">
                          {Array.from({ length: 12 }, (_, i) => {
                            const height = Math.random() * 100 + 20;
                            return (
                              <div
                                key={i}
                                className="bg-blue-500 rounded-t flex-1"
                                style={{ height: `${height}%` }}
                              />
                            );
                          })}
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mt-2">
                          <span>Jan</span>
                          <span>Dec</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default IndiaMapDashboard;
