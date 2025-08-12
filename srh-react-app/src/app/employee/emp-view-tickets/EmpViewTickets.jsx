import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './EmpViewTickets.css';
import EmpLayout from '../emp-layout/EmpLayout';

export default function EmpViewTickets() {
  const [employee, setEmployee] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filterSelected, setFilterSelected] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem('employeeId');
    if (storedId) {
      setEmployeeId(storedId);
    } else {
      setErrorMsg('Employee ID not found. Please login again.');
      return;
    }
  }, []);

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeTickets(employeeId);
    }
  }, [employeeId]);

  async function fetchEmployeeTickets(empId) {
    try {
      const resp = await axios.get(`/api/emp/viewMyTickets/${empId}`);
      if (resp.data?.status === 'success') {
        setEmployee(resp.data?.data);
      } else {
        setErrorMsg(resp.data?.message || "Failed to load tickets");
      }
    } catch (err) {
      setErrorMsg("Server error: " + err.message);
    }
  }

  const handleFilterChange = (e) => {
    const selected = e.target.value.toLowerCase();
    setStatusFilter(selected);
    setFilterSelected(true);
  };

  const filteredTickets = employee?.tickets?.filter((ticket) =>
    statusFilter === 'all'
      ? true
      : ticket.status?.toLowerCase() === statusFilter
  ) || [];

  const statusCounts = {
    raised: 0,
    in_progress: 0,
    assigned: 0,
    cancelled: 0,
    closed: 0,
    started: 0,
  };

  employee?.tickets.forEach((ticket) => {
    if (ticket.status) {
      const status = ticket.status.toLowerCase();
      if (statusCounts[status] !== undefined) {
        statusCounts[status]++;
      }
    }
  });

  return (
    <EmpLayout>
      <div className="container mt-5 fade-in">
        <div className="ticket-card shadow">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="main-heading mb-0">🎟️ My Tickets</h3>
            </div>

            {/* Status Cards */}
            <div className="status-cards mb-4">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div className="status-card" key={status}>
                  <div className="status-card-header">{status.replace('_', ' ').toUpperCase()}</div>
                  <div className="status-card-count">{count}</div>
                </div>
              ))}
            </div>

            {/* Filter Dropdown */}
            <div className="filter-wrapper">
              <select
                className="form-select status-filter"
                value={statusFilter}
                onChange={handleFilterChange}
              >
                <option value="all">All</option>
                <option value="raised">Raised</option>
                <option value="assigned">Assigned</option>
                <option value="started">Started</option>
                <option value="in_progress">In Progress</option>
                <option value="cancelled">Cancelled</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {errorMsg && (
              <div className="alert alert-danger text-center">{errorMsg}</div>
            )}

            {filterSelected && employee && (
              <div className="table-responsive">
                <table className="table custom-table table-hover align-middle">
                  <thead className="table-dark text-center">
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Department Comment</th>
                      <th>Commenter Name</th>
                      <th>Commenter Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.length > 0 ? (
                      filteredTickets.map((ticket, index) => (
                        <tr key={index} className="hover-row text-center">
                          <td>{ticket.title}</td>
                          <td>{ticket.description}</td>
                          <td>
                            <span className={`badge badge-${ticket.status.toLowerCase()}`}>
                              {ticket.status?.charAt(0).toUpperCase() + ticket.status?.slice(1).toLowerCase()}
                            </span>
                          </td>
                          <td>{ticket.commentText || <span className="text-muted">No comment</span>}</td>
                          <td>{ticket.commenterName || <span className="text-muted">N/A</span>}</td>
                          <td>{ticket.commenterRole || <span className="text-muted">N/A</span>}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center text-muted">
                          No tickets found for selected status.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {!filterSelected && !errorMsg && (
              <p className="text-center text-muted mt-4">Please select a status to view your tickets.</p>
            )}
          </div>
        </div>
      </div>
    </EmpLayout>
  );
}
