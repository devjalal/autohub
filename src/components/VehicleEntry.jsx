import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

const VehicleEntry = ({ onAdd, onSuccess }) => {
  const [formData, setFormData] = useState({
    carName: '',
    numberPlate: '',
    ownerName: '',
    phoneNumber: '',
    address: '',
    arrivalDate: new Date().toISOString().split('T')[0],
    expectedDelivery: '',
    services: '',
    notes: '',
    status: 'In Service'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    onSuccess();
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">New Vehicle Entry</h1>
          <p className="page-subtitle">Register a new vehicle for service.</p>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Car Name / Model *</label>
              <input 
                type="text" 
                name="carName" 
                required 
                placeholder="e.g. Honda Civic 2020" 
                value={formData.carName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Number Plate *</label>
              <input 
                type="text" 
                name="numberPlate" 
                required 
                placeholder="e.g. KL-01-AB-1234" 
                value={formData.numberPlate}
                onChange={handleChange}
                style={{ textTransform: 'uppercase' }}
              />
            </div>
          </div>

          <h3 style={{ marginTop: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Owner Details</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Owner Name *</label>
              <input 
                type="text" 
                name="ownerName" 
                required 
                value={formData.ownerName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input 
                type="tel" 
                name="phoneNumber" 
                required 
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Address (Optional)</label>
            <textarea 
              name="address" 
              rows="2" 
              value={formData.address}
              onChange={handleChange}
            ></textarea>
          </div>

          <h3 style={{ marginTop: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Service Schedule</h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date of Arrival *</label>
              <input 
                type="date" 
                name="arrivalDate" 
                required 
                value={formData.arrivalDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Expected Delivery Date *</label>
              <input 
                type="date" 
                name="expectedDelivery" 
                required 
                value={formData.expectedDelivery}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Services Required *</label>
            <textarea 
              name="services" 
              required 
              rows="3" 
              placeholder="e.g. Oil change, Brake pad replacement, Full wash" 
              value={formData.services}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Special Instructions / Notes</label>
            <textarea 
              name="notes" 
              rows="2" 
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="flex justify-between items-center mt-4" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onSuccess}>
              <X size={18} /> Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={18} /> Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleEntry;
