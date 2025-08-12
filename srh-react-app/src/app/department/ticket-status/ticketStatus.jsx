import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import DepartmentLayout from '../departmentLayout/DepartmentLayout';

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
      .catch(() => {
        setLoading(false);
        setIsError(true);
        setErrorMsg('Network error while fetching tickets.');
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

    axios.put('/api/department/ticket/status', payload)
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
    .catch(() => {
      setLoading(false);
      setIsError(true);
      setErrorMsg('Network error while updating status.');
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ASSIGNED': return 'bg-warning text-dark';
      case 'IN_PROGRESS': return 'bg-primary';
      case 'ISSUE_RESOLVED': return 'bg-info text-dark';
      case 'CLOSED': return 'bg-secondary';
      default: return 'bg-light text-dark';
    }
  };

  return (
    <DepartmentLayout>
      <div className="container py-5">
        <h2 className="mb-5 text-primary fw-bold text-center">Update Ticket Status</h2>

        <div className="card shadow-sm rounded-4 p-4 mx-auto" style={{ maxWidth: '720px' }}>
          <div className="mb-4">
            <label htmlFor="deptId" className="form-label fw-semibold">Select Department</label>
            <select
              id="deptId"
              className="form-select form-select-lg"
              value={selectedDepartmentId ?? ''}
              onChange={(e) => setSelectedDepartmentId(e.target.value ? parseInt(e.target.value) : null)}
              disabled={loading}
            >
              <option value="" disabled>Select Department</option>
              <option value="1">IT Support</option>
              <option value="2">Non IT Support</option>
              <option value="3">HR Support</option>
            </select>
          </div>

          <div className="mb-4 text-center">
            <button
              className="btn btn-primary btn-lg px-5 shadow-sm"
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

          {departmentTickets.length > 0 && (
            <div className="mb-4">
              <label htmlFor="ticketId" className="form-label fw-semibold">Select Ticket</label>
              <select
                id="ticketId"
                className="form-select form-select-lg"
                value={ticketId ?? ''}
                onChange={onTicketSelect}
                disabled={loading}
              >
                <option value="" disabled>Select Ticket</option>
                {departmentTickets.map(ticket => (
                  <option key={ticket.ticketId} value={ticket.ticketId}>
                    {ticket.ticketId} - {ticket.description?.slice(0, 40)}{ticket.description?.length > 40 ? '...' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {ticketId && selectedTicket && (
            <div className="row g-4 mt-3">
              <div className="col-md-6">
                <div className="card bg-light border-start border-4 border-primary shadow-sm p-3 rounded-3">
                  <h6 className="text-muted mb-2">Current Status</h6>
                  <span className={`badge fs-6 px-3 py-2 ${getStatusBadge(selectedTicket.status)}`}>
                    {selectedTicket.status}
                  </span>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card bg-light border-start border-4 border-success shadow-sm p-3 rounded-3 d-flex flex-column">
                  <h6 className="text-muted mb-3">Update to</h6>
                  <select
                    className="form-select form-select-lg mb-3"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    disabled={loading}
                  >
                    <option value="" disabled>Select new status</option>
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <button
                    className="btn btn-success btn-lg mt-auto shadow-sm"
                    onClick={updateStatus}
                    disabled={loading || !newStatus}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : 'Update Status'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {isError && (
            <div className="alert alert-danger alert-dismissible fade show mt-4" role="alert">
              {errorMsg}
              <button type="button" className="btn-close" aria-label="Close" onClick={() => setIsError(false)}></button>
            </div>
          )}

          {successMsg && (
            <div className="alert alert-success alert-dismissible fade show mt-4" role="alert">
              {successMsg}
              <button type="button" className="btn-close" aria-label="Close" onClick={() => setSuccessMsg('')}></button>
            </div>
          )}
        </div>
      </div>
    </DepartmentLayout>
  );
}
