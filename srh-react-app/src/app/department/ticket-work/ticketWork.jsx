import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        setErrorMsg('Server error occurred while loading tickets.');
        setTickets([]);
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
        setErrorMsg('Server error occurred while accepting ticket.');
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
        setErrorMsg('Server error occurred while closing ticket.');
      });
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-primary">Department Ticket Actions</h2>

      {/* Department Selection */}
      <div className="row g-3 align-items-end mb-4">
        <div className="col-md-4">
          <label htmlFor="dept" className="form-label">Select Department</label>
          <select
            id="dept"
            className="form-select"
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
          >
            <option value="1">IT Support</option>
            <option value="2">Non-IT Support</option>
            <option value="3">HR Support</option>
          </select>
        </div>
        <div className="col-md-auto">
          <button
            onClick={fetchTickets}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load Tickets'}
          </button>
        </div>
      </div>

      {/* Feedback Messages */}
      {loading && <div className="alert alert-info">Fetching tickets...</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      {/* Ticket Cards */}
      <div className="row">
        {tickets.map(ticket => (
          <div className="col-md-6 col-lg-4 mb-4" key={ticket.ticketId}>
            <div className="card shadow h-100">
              <div className="card-body">
                <h5 className="card-title">Ticket #{ticket.ticketId}</h5>

                <p className="mb-1">
                  <strong>Status:</strong>{' '}
                  <span className={`badge ${
                    ticket.status === 'OPEN' ? 'bg-success' :
                    ticket.status === 'ASSIGNED' ? 'bg-warning text-dark' :
                    ticket.status === 'CLOSED' ? 'bg-secondary' :
                    'bg-info'
                  }`}>
                    {ticket.status}
                  </span>
                </p>

                <p className="card-text"><strong>Description:</strong> {ticket.description}</p>
                <p className="card-text"><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
                <p className="card-text"><strong>Updated:</strong> {new Date(ticket.updatedAt).toLocaleString()}</p>
              </div>

              {ticket.status !== 'CLOSED' && (
                <div className="card-footer d-flex justify-content-between">
                  {ticket.status === 'ASSIGNED' && (
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => acceptTicket(ticket.ticketId)}
                    >
                      Accept
                    </button>
                  )}
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => closeTicket(ticket.ticketId)}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
