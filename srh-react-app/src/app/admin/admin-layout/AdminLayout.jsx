import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import './AdminLayout.css'; // Custom styles

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-layout">
      {/* Navbar */}
      <nav className="navbar">
        <button className="menu-btn" onClick={toggleSidebar}>
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <h1 className="navbar-title">Admin Panel</h1>
      </nav>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <ul>
          <li>Dashboard</li>
          <li>Tickets</li>
          <li>Employees</li>
          <li>Settings</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className={`content ${sidebarOpen ? 'shrink' : ''}`}>
        {children}
      </main>

      {/* Footer */}
      <footer className="footer">
        &copy; {new Date().getFullYear()} Admin Dashboard
      </footer>
    </div>
  );
}
