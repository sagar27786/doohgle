import React from 'react';
import AdsManagerMain from '../components/adds Manager/Dashboard/AdsManagerMain';

// Page component used for the dedicated dashboard route
const AdsManagerDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <AdsManagerMain initialView="campaigns" />
    </div>
  );
};

export default AdsManagerDashboardPage;

