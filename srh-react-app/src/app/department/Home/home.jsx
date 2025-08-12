import React, { useState, useEffect } from 'react';
import DepartmentLayout from '../departmentLayout/DepartmentLayout';
import { LayoutDashboard, Ticket, MessageCircle } from 'lucide-react';
import axios from 'axios';

const departments = [
  { id: 1, name: 'IT Support' },
  { id: 2, name: 'Non IT Support' },
  { id: 3, name: 'HR Support' },
];

export default function Home() {
  const [departmentId, setDepartmentId] = useState(1);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate stats from tickets
  const totalTickets = tickets.length;
  const closedTickets = tickets.filter(t => t.status?.toLowerCase() === 'closed').length;
  const openTickets = totalTickets - closedTickets;

  // Fetch tickets when department changes or on refresh button click
  const fetchTickets = async () => {
    if (!departmentId) {
      setErrorMsg('Please select a valid department.');
      setTickets([]);
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await axios.get(`/api/department/tickets/${departmentId}`);
      if (res.data.status === 'success' && Array.isArray(res.data.data)) {
        setTickets(res.data.data);
      } else {
        setErrorMsg(res.data.message || 'No tickets found.');
        setTickets([]);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setErrorMsg('Failed to fetch tickets. Please try again.');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tickets on component mount and when departmentId changes
  useEffect(() => {
    fetchTickets();
  }, [departmentId]);

  return (
    <DepartmentLayout>
      <div className="container py-5">
        {/* Welcome Message */}
        <div className="text-center mb-5">
          <h1 className="text-primary fw-bold">Welcome to the Department Portal</h1>
          <p className="text-muted fs-5">
            Manage tickets, view feedback, and monitor your department’s activities efficiently.
          </p>
        </div>

        {/* Department Selector */}
        <div className="mb-4 d-flex align-items-center gap-3">
          <label htmlFor="departmentSelect" className="fw-semibold">
            Select Department:
          </label>
          <select
            id="departmentSelect"
            className="form-select w-auto"
            value={departmentId}
            onChange={e => setDepartmentId(Number(e.target.value))}
          >
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={fetchTickets} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh Stats'}
          </button>
        </div>

        {/* Show error if any */}
        {errorMsg && <div className="alert alert-danger text-center">{errorMsg}</div>}

        {/* Stats Section */}
        {!loading && !errorMsg && (
          <div className="row text-center mb-5">
            <div className="col-md-4 mb-3">
              <div className="card shadow-sm p-4 bg-light h-100">
                <LayoutDashboard size={36} className="mb-2 text-primary" />
                <h4 className="mb-1">{departments.length}</h4>
                <p className="text-muted mb-0">Departments</p>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card shadow-sm p-4 bg-light h-100">
                <Ticket size={36} className="mb-2 text-success" />
                <h4 className="mb-1">{openTickets}</h4>
                <p className="text-muted mb-0">Open Tickets</p>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card shadow-sm p-4 bg-light h-100">
                <MessageCircle size={36} className="mb-2 text-warning" />
                <h4 className="mb-1">{closedTickets}</h4>
                <p className="text-muted mb-0">Closed Tickets</p>
              </div>
            </div>
          </div>
        )}


        {/* Quick Links */}
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column align-items-center text-center">
                <LayoutDashboard size={40} className="text-primary mb-3" />
                <h5 className="card-title">Dashboard</h5>
                <p className="card-text text-muted">
                  View your department’s overall activity and performance metrics.
                </p>
                <a href="/digitalStatsDashboard" className="btn btn-outline-primary mt-auto">
                  Go to Dashboard
                </a>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column align-items-center text-center">
                <Ticket size={40} className="text-success mb-3" />
                <h5 className="card-title">Tickets</h5>
                <p className="card-text text-muted">Manage and process department tickets efficiently.</p>
                <a href="/TicketList" className="btn btn-outline-success mt-auto">
                  View Tickets
                </a>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column align-items-center text-center">
                <MessageCircle size={40} className="text-warning mb-3" />
                <h5 className="card-title">Comments</h5>
                <p className="card-text text-muted">Give comments for the tickets that users raised.</p>
                <a href="/TicketComment" className="btn btn-outline-warning">
                  Give Comment
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DepartmentLayout>
  );
}
