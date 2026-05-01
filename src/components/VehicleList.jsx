import React, { useState, useMemo } from 'react';
import { Search, Filter, Phone, Calendar, Wrench, Trash2, Edit3, Save, X } from 'lucide-react';

const VehicleList = ({ vehicles, onUpdateStatus, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchesSearch = 
        v.carName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        v.numberPlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [vehicles, searchTerm, statusFilter]);

  const handleStatusChange = (id, newStatus) => {
    onUpdateStatus(id, newStatus);
  };

  const startEditing = (vehicle) => {
    setEditingId(vehicle.id);
    setEditFormData({ ...vehicle });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveEdit = () => {
    onUpdate(editingId, editFormData);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Vehicle Management</h1>
          <p className="page-subtitle">Manage and update service records.</p>
        </div>
      </div>

      <div className="card mb-4" style={{ padding: '1rem 1.5rem' }}>
        <div className="flex gap-4 items-center" style={{ flexWrap: 'wrap' }}>
          <div className="form-group mb-0" style={{ flex: 1, minWidth: '250px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Search by car, plate, or owner..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.5rem', marginBottom: 0 }}
              />
            </div>
          </div>
          
          <div className="form-group mb-0" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '200px' }}>
            <Filter size={18} className="text-secondary" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ marginBottom: 0 }}
            >
              <option value="All">All Statuses</option>
              <option value="In Service">In Service</option>
              <option value="Ready for Delivery">Ready for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      <div className="vehicle-list">
        {filteredVehicles.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Wrench size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3>No vehicles found.</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          filteredVehicles.map(v => {
            const isEditing = editingId === v.id;

            return (
              <div key={v.id} className={`card ${v.status === 'Delivered' ? '' : new Date(v.expectedDelivery) < new Date() && v.status !== 'Ready for Delivery' ? 'urgent' : ''}`} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    {isEditing ? (
                      <div className="flex gap-2 mb-2" style={{ flexWrap: 'wrap' }}>
                        <input type="text" name="carName" value={editFormData.carName} onChange={handleEditChange} style={{ flex: 1, minWidth: '120px', padding: '0.25rem 0.5rem' }} placeholder="Car Name" />
                        <input type="text" name="numberPlate" value={editFormData.numberPlate} onChange={handleEditChange} style={{ flex: 1, minWidth: '120px', padding: '0.25rem 0.5rem', textTransform: 'uppercase' }} placeholder="Number Plate" />
                      </div>
                    ) : (
                      <>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', wordBreak: 'break-word' }}>{v.carName}</h3>
                        <span className="vehicle-plate">{v.numberPlate}</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
                    {isEditing ? (
                      <>
                        <button onClick={saveEdit} className="btn btn-success" style={{ padding: '0.5rem' }} title="Save">
                          <Save size={18} />
                        </button>
                        <button onClick={cancelEdit} className="btn btn-secondary" style={{ padding: '0.5rem' }} title="Cancel">
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <select 
                          value={v.status} 
                          onChange={(e) => handleStatusChange(v.id, e.target.value)}
                          style={{ width: 'auto', padding: '0.5rem', backgroundColor: v.status === 'In Service' ? 'rgba(59, 130, 246, 0.1)' : v.status === 'Ready for Delivery' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(148, 163, 184, 0.1)', color: v.status === 'In Service' ? 'var(--accent-primary)' : v.status === 'Ready for Delivery' ? 'var(--success)' : 'var(--text-secondary)', border: '1px solid currentColor', fontWeight: 600, fontSize: '0.85rem', borderRadius: '9999px', marginRight: '0.5rem' }}
                        >
                          <option value="In Service">In Service</option>
                          <option value="Ready for Delivery">Ready for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                        <button 
                          onClick={() => startEditing(v)}
                          style={{ background: 'none', color: 'var(--text-secondary)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}
                          title="Edit Record"
                          onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
                          onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            if(window.confirm('Are you sure you want to delete this record?')) {
                              onDelete(v.id);
                            }
                          }}
                          style={{ background: 'none', color: 'var(--text-secondary)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}
                          title="Delete Record"
                          onMouseOver={(e) => e.currentTarget.style.color = 'var(--danger)'}
                          onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <p className="text-secondary" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Owner Information</p>
                    {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <input type="text" name="ownerName" value={editFormData.ownerName} onChange={handleEditChange} style={{ padding: '0.25rem 0.5rem', fontSize: '0.9rem' }} placeholder="Owner Name" />
                        <input type="text" name="phoneNumber" value={editFormData.phoneNumber} onChange={handleEditChange} style={{ padding: '0.25rem 0.5rem', fontSize: '0.9rem' }} placeholder="Phone Number" />
                      </div>
                    ) : (
                      <>
                        <p style={{ fontWeight: 500 }}>{v.ownerName}</p>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                          <Phone size={14} /> {v.phoneNumber}
                        </p>
                      </>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-secondary" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Schedule</p>
                    {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', width: '40px' }}>Arr:</span>
                          <input type="date" name="arrivalDate" value={editFormData.arrivalDate} onChange={handleEditChange} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', width: '40px' }}>Due:</span>
                          <input type="date" name="expectedDelivery" value={editFormData.expectedDelivery} onChange={handleEditChange} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} />
                        </div>
                      </div>
                    ) : (
                      <>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                          <Calendar size={14} className="text-secondary" /> Arrived: {new Date(v.arrivalDate).toLocaleDateString()}
                        </p>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', marginTop: '0.25rem', color: new Date(v.expectedDelivery) < new Date() && v.status !== 'Ready for Delivery' && v.status !== 'Delivered' ? 'var(--danger)' : 'inherit' }}>
                          <Calendar size={14} className="text-secondary" /> Due: {new Date(v.expectedDelivery).toLocaleDateString()}
                        </p>
                      </>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-secondary" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Services Required</p>
                    {isEditing ? (
                      <textarea name="services" value={editFormData.services} onChange={handleEditChange} style={{ padding: '0.25rem 0.5rem', fontSize: '0.9rem', width: '100%', minHeight: '60px' }} />
                    ) : (
                      <p style={{ fontSize: '0.9rem', whiteSpace: 'pre-line' }}>{v.services}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default VehicleList;
