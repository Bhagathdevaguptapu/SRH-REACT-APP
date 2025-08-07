import React, { useState } from 'react';
import {
  Menu,
  X,
  LayoutDashboard,
  Ticket,
  MessageCircle,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AdminLayout.css';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="admin-layout">
      {/* Navbar */}
      <nav className="navbar">
        <button className="menu-btn" onClick={toggleSidebar}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="navbar-title">Admin Panel</h1>
      </nav>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <ul>
          <li onClick={() => handleNavigation('/admin_dashboard')}>
            <LayoutDashboard className="sidebar-icon" size={20} />
            Dashboard
          </li>
          <li onClick={() => handleNavigation('/admin_emp_tickets')}>
            <Ticket className="sidebar-icon" size={20} />
            Tickets
          </li>
          <li onClick={() => handleNavigation('/admin_emp_feedbacks')}>
            <MessageCircle className="sidebar-icon" size={20} />
            Feedback
          </li>
          <li onClick={() => handleNavigation('/admin_login')}>
            <LogOut className="sidebar-icon" size={20} />
            Logout
          </li>
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
