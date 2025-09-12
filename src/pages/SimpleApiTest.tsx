import React, { useEffect, useState } from 'react';

const SimpleApiTest: React.FC = () => {
  const [status, setStatus] = useState('Loading...');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log('🚀 Starting simple API test');
        setStatus('Fetching data...');
        
        const response = await fetch('http://localhost:4001/api/screens');
        console.log('📡 Response received:', response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('📊 Data received:', result);
        
        setData(result);
        setStatus(`Success! Received ${result.data?.length || 0} screens`);
        
      } catch (err) {
        console.error('❌ Error:', err);
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);
        setStatus('Failed');
      }
    };
    
    testApi();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Simple API Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <div className="text-lg">{status}</div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
        
        {data && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Raw API Response</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-600">
          <p>Check browser console for detailed logs</p>
          <p>Backend should be running on http://localhost:4001</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleApiTest;