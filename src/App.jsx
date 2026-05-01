import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import VehicleEntry from './components/VehicleEntry';
import VehicleList from './components/VehicleList';
import { useVehicles } from './hooks/useVehicles';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const { vehicles, addVehicle, updateVehicleStatus, updateVehicle, deleteVehicle, markAsExported } = useVehicles();

  useEffect(() => {
    // Request notification permission on load
    if ("Notification" in window && Notification.permission !== "denied" && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard vehicles={vehicles} onViewChange={setCurrentView} markAsExported={markAsExported} />;
      case 'entry':
        return <VehicleEntry onAdd={addVehicle} onSuccess={() => setCurrentView('list')} />;
      case 'list':
        return <VehicleList vehicles={vehicles} onUpdateStatus={updateVehicleStatus} onUpdate={updateVehicle} onDelete={deleteVehicle} />;
      default:
        return <Dashboard vehicles={vehicles} onViewChange={setCurrentView} markAsExported={markAsExported} />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

export default App;
