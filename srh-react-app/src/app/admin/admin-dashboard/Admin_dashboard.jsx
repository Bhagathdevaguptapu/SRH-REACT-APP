import React from 'react'
import './Admin_dashboard.css';
import { useState } from 'react';
import { FaTachometerAlt, FaUsers, FaCogs, FaSignOutAlt, FaBars } from 'react-icons/fa';


export default function Admin_dashboard() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div>
            {/* Top Navbar */}
            <nav className="navbar navbar-custom px-3">
                <button className="btn btn-dark me-2" onClick={toggleSidebar}>
                    <FaBars size={20} />
                </button>
                <span className="navbar-brand mb-0 h1 text-white">Admin Dashboard</span>
            </nav>

            <div className="d-flex">
                {/* Sidebar */}
                <div className={`sidebar ${isSidebarOpen ? '' : 'closed'}`}>
                    {isSidebarOpen && (
                        <>
                            <h5 className="mb-4">Navigation</h5>
                            <a href="">
                                <FaTachometerAlt className="me-2" /> Dashboard
                            </a>
                            <a href="">
                                <FaUsers className="me-2" /> Users
                            </a>
                            <a href="">
                                <FaCogs className="me-2" /> Settings
                            </a>
                            <a href="">
                                <FaSignOutAlt className="me-2" /> Logout
                            </a>
                        </>
                    )}
                </div>

                {/* Main Content */}
                <div className="main-content">
                    <div className="container">
                        <h2>Welcome, Admin 👋</h2>
                        <p className="text-muted">Here’s a quick overview of your dashboard activity.</p>

                        <div className="row mt-4">
                            <div className="col-md-4 mb-3">
                                <div className="card shadow-sm border-0">
                                    <div className="card-body">
                                        <h5 className="card-title">Users</h5>
                                        <p className="card-text">Manage registered users</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="card shadow-sm border-0">
                                    <div className="card-body">
                                        <h5 className="card-title">Settings</h5>
                                        <p className="card-text">Configure your system preferences</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="card shadow-sm border-0">
                                    <div className="card-body">
                                        <h5 className="card-title">Reports</h5>
                                        <p className="card-text">View detailed analytics</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
