import React, { useEffect, useState } from 'react';
import { screensService } from '../services/screensService';
import { ScreenSearchResult } from '../api/screens';

const ApiTestPage: React.FC = () => {
  const [screens, setScreens] = useState<ScreenSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(message);
  };

  const testApiCall = async () => {
    try {
      setLoading(true);
      setError(null);
      addLog('🔄 Starting API test...');
      
      // Test direct fetch first
      addLog('🌐 Testing direct fetch to http://localhost:4001/api/screens');
      const directResponse = await fetch('http://localhost:4001/api/screens');
      addLog(`📡 Direct fetch status: ${directResponse.status} ${directResponse.statusText}`);
      
      const directData = await directResponse.json();
      addLog(`📊 Direct fetch data: success=${directData.success}, count=${directData.data?.length || 0}`);
      
      // Now test through service
      addLog('🔧 Testing through screensService.getAllScreens()');
      const result = await screensService.getAllScreens();
      
      addLog(`✅ Service call successful, received ${result.length} screens`);
      setScreens(result);
      
      result.forEach((screen, index) => {
        addLog(`📍 Screen ${index + 1}: ${screen.name} at ${screen.city} (${screen.latitude}, ${screen.longitude})`);
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      addLog(`❌ API call failed: ${errorMessage}`);
      console.error('Full error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    addLog('🚀 ApiTestPage mounted');
    testApiCall();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          API Test Page
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Logs Panel */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
            <div className="bg-gray-50 rounded p-4 h-64 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="text-sm font-mono mb-1">
                  {log}
                </div>
              ))}
            </div>
            <button 
              onClick={testApiCall}
              disabled={loading}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test API Again'}
            </button>
          </div>
          
          {/* Results Panel */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">API Results</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded mb-4">
                <strong>Error:</strong> {error}
              </div>
            )}
            
            <div className="space-y-2">
              <div><strong>Status:</strong> {loading ? 'Loading...' : 'Complete'}</div>
              <div><strong>Screens Found:</strong> {screens.length}</div>
              
              {screens.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Screen Details:</h3>
                  <div className="bg-gray-50 rounded p-4 h-64 overflow-y-auto">
                    {screens.map((screen, index) => (
                      <div key={screen.id} className="border-b pb-2 mb-2 last:border-b-0">
                        <div className="font-medium">{screen.name}</div>
                        <div className="text-sm text-gray-600">
                          {screen.city} | Lat: {screen.latitude} | Lng: {screen.longitude}
                        </div>
                        <div className="text-sm text-gray-500">
                          Status: {screen.is_active ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTestPage;