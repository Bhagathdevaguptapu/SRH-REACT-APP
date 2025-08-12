import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  LayoutDashboard,
  Ticket,
  MessageCircle,
  LogOut
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminLayout.css';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      navigate('/');
      setSidebarOpen(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = newTheme;
    localStorage.setItem('theme', newTheme);
  };

  const menuItems = [
    { path: '/admin_dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin_emp_tickets', icon: <Ticket size={20} />, label: 'Tickets' },
    { path: '/admin_emp_feedbacks', icon: <MessageCircle size={20} />, label: 'Feedback' },
  ];

  return (
    <div className={`admin-layout ${theme}`}>
      <nav className="navbar">
        <button className="menu-btn" onClick={toggleSidebar}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="navbar-title">Admin Panel</h1>
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme" />
      </nav>

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.path}
              className={location.pathname === item.path ? 'active' : ''}
              onClick={() => handleNavigation(item.path)}
            >
              {item.icon}
              <span>{item.label}</span>
            </li>
          ))}
          <li onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </li>
        </ul>
      </aside>

      <main className={`content ${sidebarOpen ? 'shrink' : ''}`}>
        {children}
      </main>

      <footer className="footer">
        &copy; {new Date().getFullYear()} Admin Dashboard
      </footer>
    </div>
  );
}
