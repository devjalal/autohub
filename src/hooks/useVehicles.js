import { useState, useEffect } from 'react';
import { isBefore, addDays, isSameDay, startOfDay } from 'date-fns';
import { downloadPDF } from '../utils/exportPdf';

export function useVehicles() {
  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem('workshop_vehicles');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    localStorage.setItem('workshop_vehicles', JSON.stringify(vehicles));
    checkNotifications(vehicles);
  }, [vehicles]);

  // Tab Close Warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = ''; // Required for the prompt to show in modern browsers
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Automatic PDF Export Check
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastExportDate = localStorage.getItem('last_auto_export_date');
    
    // If we haven't exported today and there are vehicles, do it
    if (lastExportDate !== today && vehicles.length > 0) {
      // Delay it slightly so it doesn't interrupt immediate rendering
      const timer = setTimeout(() => {
        downloadPDF(vehicles, true);
        localStorage.setItem('last_auto_export_date', today);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [vehicles]);

  const addVehicle = (vehicle) => {
    const newVehicle = {
      ...vehicle,
      id: window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substring(2),
      createdAt: new Date().toISOString(),
    };
    setVehicles([newVehicle, ...vehicles]);
    setHasUnsavedChanges(true);
  };

  const updateVehicleStatus = (id, status) => {
    setVehicles(vehicles.map(v => v.id === id ? { ...v, status } : v));
    setHasUnsavedChanges(true);
  };

  const updateVehicle = (id, updatedData) => {
    setVehicles(vehicles.map(v => v.id === id ? { ...v, ...updatedData, updatedAt: new Date().toISOString() } : v));
    setHasUnsavedChanges(true);
  };

  const deleteVehicle = (id) => {
    setVehicles(vehicles.filter(v => v.id !== id));
    setHasUnsavedChanges(true);
  };
  
  const markAsExported = () => {
    setHasUnsavedChanges(false);
  };

  const checkNotifications = (currentVehicles) => {
    if (!("Notification" in window)) return;
    
    if (Notification.permission === "granted") {
      const today = startOfDay(new Date());
      const tomorrow = addDays(today, 1);

      currentVehicles.forEach(v => {
        if (v.status === 'Delivered') return;

        const deliveryDate = startOfDay(new Date(v.expectedDelivery));
        
        // 1 day before
        if (isSameDay(deliveryDate, tomorrow)) {
          new Notification(`Reminder: ${v.carName}`, {
            body: `Vehicle ${v.numberPlate} is due for delivery tomorrow.`,
            icon: '/vite.svg'
          });
        }
        
        // Overdue
        if (isBefore(deliveryDate, today) && v.status !== 'Ready for Delivery') {
          new Notification(`Urgent: ${v.carName} Overdue`, {
            body: `Vehicle ${v.numberPlate} delivery is overdue!`,
            icon: '/vite.svg'
          });
        }
      });
    }
  };

  return { vehicles, addVehicle, updateVehicleStatus, updateVehicle, deleteVehicle, markAsExported };
}
