import React, { useState } from 'react';
import { LayoutDashboard, CarFront, List, Menu, X, Settings } from 'lucide-react';

const Layout = ({ children, currentView, onViewChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'entry', label: 'New Vehicle', icon: CarFront },
    { id: 'list', label: 'Vehicle List', icon: List },
  ];

  const handleNavClick = (id) => {
    onViewChange(id);
    setSidebarOpen(false);
  };

  return (
    <div className="app-container">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-0 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 5 }}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <Settings size={28} className="text-accent-primary" />
          <span>AutoHub</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content animate-fade-in">
        <div className="mobile-header">
          <button 
            className="mobile-toggle"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <span style={{ fontSize: '1.25rem', fontWeight: 600, fontFamily: 'var(--font-display)' }}>AutoHub</span>
        </div>
        {children}
      </main>
    </div>
  );
};

export default Layout;
