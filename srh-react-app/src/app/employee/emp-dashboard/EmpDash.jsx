import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import './EmpDash.css';
import EmpLayout from '../emp-layout/EmpLayout';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default function EmpDash() {
  const [employeeId, setEmployeeId] = useState(null);
  const [employeeName, setEmployeeName] = useState('');
  const [ticketStats, setTicketStats] = useState({ raised: 0, canceled: 0, closed: 0 });
  const [recentTickets, setRecentTickets] = useState([]);
  const [recentClosedTickets, setRecentClosedTickets] = useState([]);
  const [currentRaisedIndex, setCurrentRaisedIndex] = useState(0);
  const [currentClosedIndex, setCurrentClosedIndex] = useState(0);
  const [showPieChart, setShowPieChart] = useState(true);

  useEffect(() => {
    const storedId = localStorage.getItem('employeeId');
    if (storedId) {
      setEmployeeId(storedId);
    } else {
      console.error('Employee ID not found. Please log in again.');
    }
  }, []);

  useEffect(() => {
    if (employeeId) {
      fetchTicketStats();
    }
  // Only run when employeeId changes
  }, [employeeId]);

  useEffect(() => {
    const interval = setInterval(fetchTicketStats, 60000);
    const raisedInterval = setInterval(() => setCurrentRaisedIndex(prev => (prev + 1) % (recentTickets.length || 1)), 2000);
    const closedInterval = setInterval(() => setCurrentClosedIndex(prev => (prev + 1) % (recentClosedTickets.length || 1)), 2000);
    const chartToggleInterval = setInterval(() => setShowPieChart(prev => !prev), 5000);

    return () => {
      clearInterval(interval);
      clearInterval(raisedInterval);
      clearInterval(closedInterval);
      clearInterval(chartToggleInterval);
    };
  }, [recentTickets.length, recentClosedTickets.length]);

  const fetchTicketStats = async () => {
    try {
      const resp = await axios.get(`/api/emp/viewMyTickets/${employeeId}`);
      if (resp.data?.status === 'success') {
        const { tickets = [], name } = resp.data.data;
        setEmployeeName(name || '');

        const stats = { raised: 0, canceled: 0, closed: 0 };
        const raised = [], closed = [];

        tickets.forEach(ticket => {
          const status = ticket.status?.toLowerCase();
          const formatted = {
            id: ticket.ticketId,
            title: ticket.title,
            date: ticket.date || (ticket.createdAt?.split('T')[0] ?? '')
          };

          if (status === 'raised') {
            stats.raised++;
            raised.push(formatted);
          } else if (status === 'cancelled' || status === 'canceled') {
            stats.canceled++;
          } else if (status === 'closed') {
            stats.closed++;
            closed.push(formatted);
          }
        });

        raised.sort((a, b) => new Date(b.date) - new Date(a.date));
        closed.sort((a, b) => new Date(b.date) - new Date(a.date));

        setTicketStats(stats);
        setRecentTickets(raised.slice(0, 5));
        setRecentClosedTickets(closed.slice(0, 5));
      } else {
        console.error('Failed to load stats:', resp.data?.message);
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
    }
  };

  const pieChartData = {
    labels: ['Raised', 'Canceled', 'Closed'],
    datasets: [{
      data: [ticketStats.raised, ticketStats.canceled, ticketStats.closed],
      backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
      hoverOffset: 6,
    }],
  };

  const barChartData = {
    labels: ['Raised', 'Canceled', 'Closed'],
    datasets: [{
      label: 'Tickets',
      data: [ticketStats.raised, ticketStats.canceled, ticketStats.closed],
      backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
    }],
  };

  return (
    <EmpLayout>
      <div className="emp-layout-wrapper">
        {employeeName && <h2 className="welcome-msg">Welcome, {employeeName}!</h2>}
        <h2 className="section-title">Ticket Overview</h2>

        <div className="kpi-cards">
          <div className="kpi-card raised">🎫 Raised: {ticketStats.raised}</div>
          <div className="kpi-card canceled">❌ Canceled: {ticketStats.canceled}</div>
          <div className="kpi-card closed">✅ Closed: {ticketStats.closed}</div>
        </div>

        <div className="chart-and-recent">
          <div className="chart-container">
            {showPieChart ? <Pie data={pieChartData} /> : <Bar data={barChartData} />}
          </div>

          <div className="recent-ticket-columns">
            <div className="recent-tickets">
              <h3>Recent Raised Tickets</h3>
              {recentTickets.length > 0 ? (
                <>
                  <div className="ticket-item raised">
                    <div><strong>Title:</strong> {recentTickets[currentRaisedIndex].title}</div>
                    <div><strong>Status:</strong> Raised</div>
                  </div>
                  <div className="ticket-nav">
                    <button onClick={() => setCurrentRaisedIndex(prev => (prev - 1 + recentTickets.length) % recentTickets.length)}>⬅</button>
                    <span>{currentRaisedIndex + 1}/{recentTickets.length}</span>
                    <button onClick={() => setCurrentRaisedIndex(prev => (prev + 1) % recentTickets.length)}>➡</button>
                  </div>
                </>
              ) : (
                <p className="text-muted">No raised tickets yet.</p>
              )}
            </div>

            <div className="recent-tickets">
              <h3>Recent Closed Tickets</h3>
              {recentClosedTickets.length > 0 ? (
                <>
                  <div className="ticket-item closed">
                    <div><strong>Title:</strong> {recentClosedTickets[currentClosedIndex].title}</div>
                    <div><strong>Status:</strong> Closed</div>
                  </div>
                  <div className="ticket-nav">
                    <button onClick={() => setCurrentClosedIndex(prev => (prev - 1 + recentClosedTickets.length) % recentClosedTickets.length)}>⬅</button>
                    <span>{currentClosedIndex + 1}/{recentClosedTickets.length}</span>
                    <button onClick={() => setCurrentClosedIndex(prev => (prev + 1) % recentClosedTickets.length)}>➡</button>
                  </div>
                </>
              ) : (
                <p className="text-muted">No closed tickets yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </EmpLayout>
  );
}
