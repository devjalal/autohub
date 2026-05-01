import React from 'react';
import { isSameDay, startOfDay, addDays } from 'date-fns';
import { CarFront, Clock, CheckCircle, AlertTriangle, Download } from 'lucide-react';
import { downloadPDF } from '../utils/exportPdf';

const Dashboard = ({ vehicles, onViewChange, markAsExported }) => {
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);

  const todayIncoming = vehicles.filter(v => isSameDay(new Date(v.arrivalDate), today)).length;
  const pendingDeliveries = vehicles.filter(v => v.status === 'In Service' || v.status === 'Ready for Delivery').length;
  const completedToday = vehicles.filter(v => v.status === 'Ready for Delivery' && isSameDay(new Date(v.updatedAt || v.createdAt), today)).length;
  const urgentVehicles = vehicles.filter(v => {
    if (v.status === 'Delivered') return false;
    const deliveryDate = startOfDay(new Date(v.expectedDelivery));
    // Include vehicles due tomorrow or earlier
    return deliveryDate <= tomorrow && v.status !== 'Ready for Delivery';
  });

  const handleExport = () => {
    downloadPDF(vehicles, false);
    if (markAsExported) markAsExported();
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back. Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-secondary" onClick={handleExport}>
            <Download size={18} /> Export PDF
          </button>
          <button className="btn btn-primary" onClick={() => onViewChange('entry')}>
            + New Vehicle
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card stat-card stat-primary">
          <div className="stat-icon"><CarFront /></div>
          <div className="stat-info">
            <h3>{todayIncoming}</h3>
            <p>Today's Incoming</p>
          </div>
        </div>
        
        <div className="card stat-card stat-warning">
          <div className="stat-icon"><Clock /></div>
          <div className="stat-info">
            <h3>{pendingDeliveries}</h3>
            <p>Pending Services</p>
          </div>
        </div>

        <div className="card stat-card stat-success">
          <div className="stat-icon"><CheckCircle /></div>
          <div className="stat-info">
            <h3>{completedToday}</h3>
            <p>Completed Today</p>
          </div>
        </div>

        <div className="card stat-card stat-danger">
          <div className="stat-icon"><AlertTriangle /></div>
          <div className="stat-info">
            <h3>{urgentVehicles.length}</h3>
            <p>Urgent Deliveries</p>
          </div>
        </div>
      </div>

      <div className="flex-col gap-4">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Urgent Action Required</h2>
        {urgentVehicles.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <CheckCircle size={48} style={{ margin: '0 auto 1rem', color: 'var(--success)', opacity: 0.5 }} />
            <p>No urgent vehicles pending. Great job!</p>
          </div>
        ) : (
          <div className="vehicle-list">
            {urgentVehicles.map(v => (
              <div key={v.id} className="card vehicle-card urgent">
                <div className="vehicle-info-grid">
                  <div>
                    <div className="vehicle-header">
                      <h4>{v.carName}</h4>
                      <span className="vehicle-plate">{v.numberPlate}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-secondary" style={{ fontSize: '0.85rem' }}>Owner</span>
                    <p style={{ fontWeight: 500 }}>{v.ownerName}</p>
                  </div>
                  <div>
                    <span className="text-secondary" style={{ fontSize: '0.85rem' }}>Due Date</span>
                    <p className="text-danger" style={{ fontWeight: 500 }}>{new Date(v.expectedDelivery).toLocaleDateString()}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge badge-${v.status === 'In Service' ? 'inservice' : 'ready'}`}>
                      {v.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
