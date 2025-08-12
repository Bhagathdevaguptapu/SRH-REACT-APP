import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import DepartmentLayout from '../departmentLayout/DepartmentLayout';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

export default function TicketWork() {
  const [departmentId, setDepartmentId] = useState('1');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  function fetchTickets() {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    axios.get(`/api/department/tickets/${departmentId}`)
      .then(response => {
        setLoading(false);
        if (response.data?.status?.toLowerCase() === 'success') {
          setTickets(response.data.data);
          setSuccessMsg(`${response.data.data.length} ticket(s) loaded.`);
        } else {
          setTickets([]);
          setErrorMsg(response.data.message || 'Failed to load tickets');
        }
      })
      .catch(() => {
        setLoading(false);
        setErrorMsg('Network or server error while loading tickets.');
      });
  }

  function acceptTicket(ticketId) {
    setSuccessMsg('');
    setErrorMsg('');

    axios.put(`/api/department/ticket/accept/${ticketId}`)
      .then(response => {
        if (response.data?.status === 'success') {
          setSuccessMsg(response.data.message);
          fetchTickets();
        } else {
          setErrorMsg(response.data.message || 'Failed to accept ticket');
        }
      })
      .catch(() => {
        setErrorMsg('Network or server error while accepting ticket.');
      });
  }

  function closeTicket(ticketId) {
    const reason = prompt('Enter reason for closing the ticket:');
    if (!reason) return;

    setSuccessMsg('');
    setErrorMsg('');

    axios.put(`/api/department/ticket/close`, { ticketId, reason })
      .then(response => {
        if (response.data?.status === 'success') {
          setSuccessMsg(response.data.message);
          fetchTickets();
        } else {
          setErrorMsg(response.data.message || 'Failed to close ticket');
        }
      })
      .catch(() => {
        setErrorMsg('Network or server error while closing ticket.');
      });
  }

  // Helper to get badge color & icon by status
  const getStatusInfo = (status) => {
    switch (status.toUpperCase()) {
      case 'OPEN':
        return { color: 'success', icon: <CheckCircle size={18} className="me-1" /> };
      case 'ASSIGNED':
        return { color: 'warning', icon: <Clock size={18} className="me-1" /> };
      case 'CLOSED':
        return { color: 'secondary', icon: <XCircle size={18} className="me-1" /> };
      default:
        return { color: 'info', icon: null };
    }
  };

  return (
    <DepartmentLayout>
      <div className="container my-5">
        <h2 className="mb-4 text-primary fw-bold">Department Ticket Actions</h2>

        <div className="row g-3 align-items-end mb-4">
          <div className="col-md-4">
            <label htmlFor="dept" className="form-label fw-semibold">Select Department</label>
            <select
              id="dept"
              className="form-select"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              disabled={loading}
            >
              <option value="1">IT Support</option>
              <option value="2">Non-IT Support</option>
              <option value="3">HR Support</option>
            </select>
          </div>
          <div className="col-md-auto">
            <button
              onClick={fetchTickets}
              className="btn btn-primary px-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Loading...
                </>
              ) : (
                'Load Tickets'
              )}
            </button>
          </div>
        </div>

        {successMsg && <div className="alert alert-success py-2">{successMsg}</div>}
        {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {tickets.map(ticket => {
            const { color, icon } = getStatusInfo(ticket.status);
            const desc = ticket.description.length > 120
              ? ticket.description.slice(0, 117) + '...'
              : ticket.description;

            return (
              <div className="col" key={ticket.ticketId}>
                <div className="card shadow-sm h-100 border-0 rounded-3">
                  <div className="card-body d-flex flex-column">
                    <div className="mb-2 d-flex align-items-center">
                      <span className={`badge bg-${color} d-flex align-items-center fw-semibold`}>
                        {icon} {ticket.status}
                      </span>
                    </div>

                    <p className="card-text mb-3" title={ticket.description} style={{ cursor: ticket.description.length > 120 ? 'help' : 'default' }}>
                      <strong>Description:</strong> {desc}
                    </p>

                    <div className="mt-auto">
                      <p className="mb-1 text-muted small">
                        <strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}
                      </p>
                      <p className="mb-3 text-muted small">
                        <strong>Updated:</strong> {new Date(ticket.updatedAt).toLocaleString()}
                      </p>

                      {ticket.status !== 'CLOSED' && (
                        <div className="d-flex gap-2">
                          {ticket.status === 'ASSIGNED' && (
                            <button
                              className="btn btn-outline-primary btn-sm flex-grow-1"
                              onClick={() => acceptTicket(ticket.ticketId)}
                            >
                              Accept
                            </button>
                          )}

                          <button
                            className="btn btn-outline-danger btn-sm flex-grow-1"
                            onClick={() => closeTicket(ticket.ticketId)}
                          >
                            Close
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!loading && tickets.length === 0 && (
          <p className="text-center text-muted mt-5">No tickets loaded. Please select a department and load tickets.</p>
        )}
      </div>
    </DepartmentLayout>
  );
}
