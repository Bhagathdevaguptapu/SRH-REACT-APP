import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../admin-layout/AdminLayout';
import './Admin_dashboard.css';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { FaTicketAlt, FaCommentAlt, FaTasks, FaBuilding } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Admin_dashboard() {
  const [ticketsData, setTicketsData] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Define a consistent color palette for the dashboard
  const palette = {
    adminPrimary: '#4A55A2', // A deep, professional blue
    adminSecondary: '#8F8EFF',
    adminSuccess: '#50C878', // Emerald Green
    adminInfo: '#64B5F6', // Lighter Sky Blue
    adminWarning: '#FFBF00', // Amber Yellow
    adminDanger: '#E55353', // A soft red
    adminGray: '#E0E0E0',
    adminLightGray: '#F7F9FC', // Very light background
    adminDarkGray: '#333333',
    adminCardBackground: '#FFFFFF',
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const ticketsRes = await axios.get('/api/admin/employees/tickets');
        const feedbackRes = await axios.get('/api/admin/feedbacks');
        setTicketsData(ticketsRes.data.data);
        setFeedbacks(feedbackRes.data.data);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  const allTickets = ticketsData.flatMap(emp =>
    emp.tickets.map(ticket => ({
      ...ticket,
      employeeName: emp.name,
      employeeId: emp.employeeId,
      department: emp.department || 'Unknown',
    }))
  );

  const totalTickets = allTickets.length;
  const totalFeedbacks = feedbacks.length;

  const statusCounts = allTickets.reduce((acc, ticket) => {
    acc[ticket.status] = (acc[ticket.status] || 0) + 1;
    return acc;
  }, {});

  const assignedDepartmentCounts = {};
  allTickets.forEach(ticket => {
    const deptKey = ticket.assignedToDepartmentName || 'Unassigned';
    if (!assignedDepartmentCounts[deptKey]) assignedDepartmentCounts[deptKey] = 0;
    assignedDepartmentCounts[deptKey]++;
  });

  const uniqueDepartments = new Set();
  allTickets.forEach(ticket => {
    if (ticket.assignedToDepartmentName) {
      uniqueDepartments.add(ticket.assignedToDepartmentName);
    }
  });
  const totalDepartments = uniqueDepartments.size;
  
  // Update status and department colors to match the new palette
  const statusColors = [
    palette.adminPrimary, palette.adminSuccess, palette.adminInfo, palette.adminWarning, 
    palette.adminDanger, palette.adminSecondary, '#8884d8', '#82ca9d'
  ];

  const assignedDeptColors = Object.keys(assignedDepartmentCounts).map(
    (_, i) => statusColors[i % statusColors.length]
  );
  
  // Chart data configurations
  const barChartData = {
    labels: Object.keys(statusCounts).map(s => s.replace(/_/g, ' ')),
    datasets: [{
      label: 'Number of Tickets',
      data: Object.values(statusCounts),
      backgroundColor: statusColors,
      borderRadius: 5,
    }],
  };

  const pieChartData = {
    labels: ['Tickets', 'Feedbacks'],
    datasets: [{
      label: 'Overall Data',
      data: [totalTickets, totalFeedbacks],
      backgroundColor: [palette.adminPrimary, palette.adminSuccess],
    }],
  };

  const assignedDeptChartData = {
    labels: Object.keys(assignedDepartmentCounts),
    datasets: [{
      label: 'Tickets by Assigned Department',
      data: Object.values(assignedDepartmentCounts),
      backgroundColor: assignedDeptColors,
      borderRadius: 5,
    }],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 10,
        displayColors: true,
        cornerRadius: 4
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: palette.adminDarkGray }
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: palette.adminDarkGray
        }
      }
    }
  };

  const pieOptions = {
    ...chartOptions,
    scales: {} // Pie charts don't use scales
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard-container">
        <h2 className="admin-dashboard-heading">Dashboard Overview</h2>
        <p className="admin-dashboard-subheading">A summary of tickets and feedbacks across the organization.</p>
        
        {/* Summary Cards */}
        <div className="row g-4 mb-5">
          <div className="col-md-3">
            <div className="card admin-summary-card">
              <div className="card-body">
                <FaTicketAlt className="admin-summary-icon admin-icon-primary" />
                <h5 className="admin-summary-title">Total Tickets</h5>
                <h2 className="admin-summary-value">{totalTickets}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card admin-summary-card">
              <div className="card-body">
                <FaCommentAlt className="admin-summary-icon admin-icon-success" />
                <h5 className="admin-summary-title">Total Feedbacks</h5>
                <h2 className="admin-summary-value">{totalFeedbacks}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card admin-summary-card">
              <div className="card-body">
                <FaTasks className="admin-summary-icon admin-icon-info" />
                <h5 className="admin-summary-title">Status Types</h5>
                <h2 className="admin-summary-value">{Object.keys(statusCounts).length}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card admin-summary-card">
              <div className="card-body">
                <FaBuilding className="admin-summary-icon admin-icon-warning" />
                <h5 className="admin-summary-title">Departments</h5>
                <h2 className="admin-summary-value">{totalDepartments}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card admin-chart-card">
              <h5 className="card-title text-center">Ticket Status Overview</h5>
              <div className="admin-chart-container">
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card admin-chart-card">
              <h5 className="card-title text-center">Tickets vs Feedbacks</h5>
              <div className="admin-chart-container">
                <Pie data={pieChartData} options={pieOptions} />
              </div>
            </div>
          </div>
          <div className="col-md-12 mt-4">
            <div className="card admin-chart-card">
              <h5 className="card-title text-center">Tickets by Assigned Department</h5>
              <div className="admin-chart-container">
                <Bar data={assignedDeptChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}