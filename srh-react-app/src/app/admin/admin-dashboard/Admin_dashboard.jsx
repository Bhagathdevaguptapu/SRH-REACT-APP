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

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Admin_dashboard() {
  const [ticketsData, setTicketsData] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

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

  // Count tickets by status
  const statusCounts = allTickets.reduce((acc, ticket) => {
    acc[ticket.status] = (acc[ticket.status] || 0) + 1;
    return acc;
  }, {});

  // Count tickets by assigned department for the chart
  const assignedDepartmentCounts = {};
  allTickets.forEach(ticket => {
    const deptKey = ticket.assignedToDepartmentName || 'Unassigned';
    if (!assignedDepartmentCounts[deptKey]) assignedDepartmentCounts[deptKey] = 0;
    assignedDepartmentCounts[deptKey]++;
  });
  
  // Count only the specific departments (excluding 'Unassigned') for the summary card
  const uniqueDepartments = new Set();
  allTickets.forEach(ticket => {
    if (ticket.assignedToDepartmentName) {
      uniqueDepartments.add(ticket.assignedToDepartmentName);
    }
  });
  const totalDepartments = uniqueDepartments.size;


  // Color palette for charts
  const palette = {
    primary: '#605DFF',
    secondary: '#8F8EFF',
    success: '#3AD984',
    info: '#5AC3FF',
    warning: '#FFC83B',
    danger: '#FF647C',
    gray: '#D0D0D0',
    lightGray: '#F5F5F5'
  };

  const statusColors = [
    palette.info, palette.primary, palette.secondary, '#5A67D8',
    palette.warning, palette.success, palette.danger, palette.gray
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
      backgroundColor: [palette.primary, palette.success],
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
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
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
      <div className="container mt-4 admin-dashboard-container">
        <h2 className="mb-5 text-center dashboard-heading">Admin Dashboard</h2>
        
        {/* Summary Cards */}
        <div className="row g-4 mb-5">
          <div className="col-md-3">
            <div className="card dashboard-summary-card primary-bg shadow-sm">
              <div className="card-body text-white text-center d-flex align-items-center justify-content-center">
                <FaTicketAlt className="summary-icon me-3" />
                <div>
                  <h5 className="mb-0">Total Tickets</h5>
                  <h2>{totalTickets}</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card dashboard-summary-card success-bg shadow-sm">
              <div className="card-body text-white text-center d-flex align-items-center justify-content-center">
                <FaCommentAlt className="summary-icon me-3" />
                <div>
                  <h5 className="mb-0">Total Feedbacks</h5>
                  <h2>{totalFeedbacks}</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card dashboard-summary-card info-bg shadow-sm">
              <div className="card-body text-white text-center d-flex align-items-center justify-content-center">
                <FaTasks className="summary-icon me-3" />
                <div>
                  <h5 className="mb-0">Status Types</h5>
                  <h2>{Object.keys(statusCounts).length}</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card dashboard-summary-card warning-bg shadow-sm">
              <div className="card-body text-white text-center d-flex align-items-center justify-content-center">
                <FaBuilding className="summary-icon me-3" />
                <div>
                  <h5 className="mb-0">Departments</h5>
                  <h2>{totalDepartments}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card dashboard-chart-card shadow-sm p-4">
              <h5 className="text-center mb-3 card-title">Ticket Status Overview</h5>
              <div className="chart-container">
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card dashboard-chart-card shadow-sm p-4">
              <h5 className="text-center mb-3 card-title">Tickets vs Feedbacks</h5>
              <div className="chart-container pie-chart-container">
                <Pie data={pieChartData} options={pieOptions} />
              </div>
            </div>
          </div>
          <div className="col-md-12 mt-4">
            <div className="card dashboard-chart-card shadow-sm p-4">
              <h5 className="text-center mb-3 card-title">Assigned Department-wise Tickets</h5>
              <div className="chart-container">
                <Bar data={assignedDeptChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}