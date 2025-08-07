import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function TicketStatus() {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [ticketId, setTicketId] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [departmentTickets, setDepartmentTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const statusOptions = ['ASSIGNED', 'IN_PROGRESS', 'ISSUE_RESOLVED', 'CLOSED'];

  const fetchDepartmentTickets = () => {
    setTicketId(null);
    setSelectedTicket(null);
    setDepartmentTickets([]);
    setNewStatus('');
    setSuccessMsg('');
    setErrorMsg('');
    setIsError(false);

    if (!selectedDepartmentId) {
      setIsError(true);
      setErrorMsg('Please select a valid department.');
      return;
    }

    setLoading(true);

    axios.get(`/api/department/tickets/${selectedDepartmentId}`)
      .then(resp => {
        setLoading(false);
        if (resp.data.status === 'success') {
          const tickets = resp.data.data;
          setDepartmentTickets(tickets);
          if (tickets.length === 0) {
            setIsError(true);
            setErrorMsg('No tickets found for the selected department.');
          }
        } else {
          setIsError(true);
          setErrorMsg(resp.data.message || 'Failed to fetch tickets.');
        }
      })
      .catch(err => {
        setLoading(false);
        setIsError(true);
        setErrorMsg('Server error occurred while fetching tickets.');
        console.error(err);
      });
  };

  const onTicketSelect = (e) => {
    const id = e.target.value ? parseInt(e.target.value) : null;
    setTicketId(id);
    setSuccessMsg('');
    setErrorMsg('');
    if (id !== null) {
      const ticket = departmentTickets.find(t => t.ticketId === id) || null;
      setSelectedTicket(ticket);
    } else {
      setSelectedTicket(null);
    }
  };

  const updateStatus = () => {
    setIsError(false);
    setSuccessMsg('');

    if (!ticketId || !newStatus) {
      setIsError(true);
      setErrorMsg('Please select both a ticket and a status.');
      return;
    }

    setLoading(true);

    const payload = { ticketId, status: newStatus };

    axios.put('/api/department/ticket/status', payload, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then(resp => {
      setLoading(false);
      if (resp.data.status === 'success') {
        setSuccessMsg(resp.data.message || 'Status updated successfully!');
        fetchDepartmentTickets();
        setTicketId(null);
        setNewStatus('');
        setSelectedTicket(null);
      } else {
        setIsError(true);
        setErrorMsg(resp.data.message || 'Failed to update status.');
      }
    })
    .catch(err => {
      setLoading(false);
      setIsError(true);
      if (err.response) {
        setErrorMsg(`Error: ${err.response.status} - ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        setErrorMsg('No response received from server.');
      } else {
        setErrorMsg(`Request error: ${err.message}`);
      }
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ASSIGNED': return 'bg-warning text-dark';
      case 'IN_PROGRESS': return 'bg-primary';
      case 'ISSUE_RESOLVED': return 'bg-info';
      case 'CLOSED': return 'bg-secondary';
      default: return 'bg-light text-dark';
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-primary">Update Ticket Status</h2>

      <div className="card p-4 shadow-sm border-0">
        {/* Department Dropdown */}
        <div className="mb-3">
          <label htmlFor="deptId" className="form-label">Select Department</label>
          <select
            id="deptId"
            className="form-select"
            value={selectedDepartmentId ?? ''}
            onChange={(e) => setSelectedDepartmentId(e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="" disabled>Select Department</option>
            <option value="1">IT Support</option>
            <option value="2">Non IT Support</option>
            <option value="3">HR Support</option>
          </select>
        </div>

        {/* Load Tickets Button */}
        <div className="mb-4">
          <button
            className="btn btn-outline-primary"
            onClick={fetchDepartmentTickets}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Loading...
              </>
            ) : 'Load Tickets'}
          </button>
        </div>

        {/* Ticket Dropdown */}
        {departmentTickets.length > 0 && (
          <div className="mb-3">
            <label htmlFor="ticketId" className="form-label">Select Ticket</label>
            <select
              id="ticketId"
              className="form-select"
              value={ticketId ?? ''}
              onChange={onTicketSelect}
            >
              <option value="" disabled>Select Ticket</option>
              {departmentTickets.map(ticket => (
                <option key={ticket.ticketId} value={ticket.ticketId}>
                  {ticket.ticketId} - {ticket.description?.slice(0, 40)}...
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status Update Section */}
        {ticketId && selectedTicket && (
          <div className="row g-4 mt-2">
            {/* Current Status */}
            <div className="col-md-6">
              <div className="card p-3 bg-light border-start border-4 border-primary shadow-sm">
                <h6 className="text-muted">Current Status</h6>
                <span className={`badge fs-6 px-3 py-2 ${getStatusBadge(selectedTicket.status)}`}>
                  {selectedTicket.status}
                </span>
              </div>
            </div>

            {/* New Status Selector */}
            <div className="col-md-6">
              <div className="card p-3 bg-light border-start border-4 border-success shadow-sm">
                <h6 className="text-muted">Update to</h6>
                <select
                  className="form-select mb-3"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="" disabled>Select new status</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <button
                  className="btn btn-success w-100"
                  onClick={updateStatus}
                  disabled={loading || !newStatus}
                >
                  {loading ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Messages */}
        {isError && <div className="alert alert-danger mt-4">{errorMsg}</div>}
        {successMsg && <div className="alert alert-success mt-4">{successMsg}</div>}
      </div>
    </div>
  );
}
