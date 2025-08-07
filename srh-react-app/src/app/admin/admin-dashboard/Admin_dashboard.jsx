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

  // Count tickets by employee's department
  const employeeDeptCounts = {};
  ticketsData.forEach(emp => {
    const dept = emp.department || 'Unknown';
    if (!employeeDeptCounts[dept]) employeeDeptCounts[dept] = 0;
    employeeDeptCounts[dept] += emp.tickets.length;
  });

  // Count tickets by assigned department
  const assignedDepartmentCounts = {};
  allTickets.forEach(ticket => {
    const deptKey = `${ticket.assignedToDepartmentName || 'Unknown'} (${ticket.assignedToDepartment || 'N/A'})`;
    if (!assignedDepartmentCounts[deptKey]) assignedDepartmentCounts[deptKey] = 0;
    assignedDepartmentCounts[deptKey]++;
  });

  const statusColors = [
    '#007bff', '#6610f2', '#6f42c1', '#e83e8c',
    '#fd7e14', '#20c997', '#17a2b8', '#28a745'
  ];

  const barChartData = {
    labels: Object.keys(statusCounts).map(s => s.replace(/_/g, ' ')),
    datasets: [
      {
        label: 'Tickets by Status',
        data: Object.values(statusCounts),
        backgroundColor: statusColors,
      },
    ],
  };

  const pieChartData = {
    labels: ['Tickets', 'Feedbacks'],
    datasets: [
      {
        label: 'Overall Data',
        data: [totalTickets, totalFeedbacks],
        backgroundColor: ['#007bff', '#28a745'],
      },
    ],
  };

  
  const assignedDeptChartData = {
    labels: Object.keys(assignedDepartmentCounts),
    datasets: [
      {
        label: 'Tickets by Assigned Department',
        data: Object.values(assignedDepartmentCounts),
        backgroundColor: Object.keys(assignedDepartmentCounts).map(
          (_, i) => statusColors[i % statusColors.length]
        ),
      },
    ],
  };

  const pieOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <AdminLayout>
      <div className="container mt-4 admin-dashboard-container">
        <h2 className="mb-4 text-center">Dashboard</h2>

        {/* Summary Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card summary-card bg-primary text-white shadow-sm">
              <div className="card-body text-center">
                <h5>Total Tickets</h5>
                <h2>{totalTickets}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card summary-card bg-success text-white shadow-sm">
              <div className="card-body text-center">
                <h5>Total Feedbacks</h5>
                <h2>{totalFeedbacks}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card summary-card bg-info text-white shadow-sm">
              <div className="card-body text-center">
                <h5>Status Types</h5>
                <h2>{Object.keys(statusCounts).length}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Graphs */}
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card p-3 shadow-sm">
              <h5 className="text-center mb-3">Ticket Status Overview</h5>
              <Bar data={barChartData} />
            </div>
          </div>

          <div className="col-md-6">
            <div className="card p-3 shadow-sm">
              <h5 className="text-center mb-3">Tickets vs Feedbacks</h5>
              <div className="pie-chart-wrapper">
                <Pie data={pieChartData} options={pieOptions} height={250} />
              </div>
            </div>
          </div>
        </div>

    

        {/* Assigned Department-wise Tickets */}
        <div className="row mt-4">
          <div className="col-md-12">
            <div className="card p-3 shadow-sm">
              <h5 className="text-center mb-3">Assigned Department-wise Tickets</h5>
              <Bar data={assignedDeptChartData} />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
