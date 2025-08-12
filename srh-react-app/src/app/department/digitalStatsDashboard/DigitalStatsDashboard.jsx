import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import DepartmentLayout from '../departmentLayout/DepartmentLayout';
import {
  Chart as ChartJS, ArcElement, Tooltip as CTooltip, Legend
} from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

ChartJS.register(ArcElement, CTooltip, Legend);

export default function DigitalStatsDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const departmentIds = [
    { id: 1, name: 'IT' },
    { id: 2, name: 'Non‑IT' },
    { id: 3, name: 'HR' },
  ];

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const all = [];
        await Promise.all(departmentIds.map(async (dept) => {
          const res = await axios.get(`/api/department/tickets/${dept.id}`);
          if (res.data.status === 'success') {
            const arr = res.data.data.map(t => ({ ...t, department: dept.name }));
            all.push(...arr);
          }
        }));
        setTickets(all);
      } catch (err) {
        console.error(err);
        setError('Failed to load tickets.');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  if (loading) return <DepartmentLayout><div className="text-center py-5">Loading dashboard...</div></DepartmentLayout>;
  if (error) return <DepartmentLayout><div className="alert alert-danger">{error}</div></DepartmentLayout>;

  const totalTickets = tickets.length;
  const commentsCount = tickets.reduce((sum, t) => sum + (t.comments?.length || 0), 0);

  const statusCounts = tickets.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(statusCounts),
    datasets: [{
      data: Object.values(statusCounts),
      backgroundColor: ['#0d6efd','#ffc107','#198754','#6c757d'],
      hoverOffset: 20,
    }],
  };

  const departmentCounts = departmentIds.map(d => ({
    name: d.name,
    count: tickets.filter(t => t.department === d.name).length
  }));

  return (
    <DepartmentLayout>
      <div className="container my-5">
        <h2 className="text-center text-primary mb-4">Digital Stats Dashboard</h2>

        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card bg-primary text-white shadow-sm">
              <div className="card-body d-flex align-items-center">
                <i className="bi bi-ticket-perforated-fill fs-1 me-3" />
                <div>
                  <h6>Total Tickets</h6>
                  <h3>{totalTickets}</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-info text-white shadow-sm">
              <div className="card-body d-flex align-items-center">
                <i className="bi bi-chat-left-text-fill fs-1 me-3" />
                <div>
                  <h6>Comments</h6>
                  <h3>{commentsCount}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5>Ticket Status</h5>
                <Pie data={pieData} />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5>Tickets by Department</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentCounts}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#198754" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DepartmentLayout>
  );
}
