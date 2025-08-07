import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './EmpViewTickets.css';

export default function EmpViewTickets() {
  const [employee, setEmployee] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filterSelected, setFilterSelected] = useState(false);
  const employeeId = 102;

  useEffect(() => {
    fetchEmployeeTickets();
  }, []);

  async function fetchEmployeeTickets() {
    try {
      const resp = await axios.get(`/api/emp/viewMyTickets/${employeeId}`);
      if (resp.data?.status === 'success') {
        setEmployee(resp.data?.data);
        console.log("Tickets from backend:", resp.data?.data?.tickets); // 🪵 DEBUG
      } else {
        setErrorMsg(resp.data?.message || "Failed to load tickets");
      }
    } catch (err) {
      setErrorMsg("Server error: " + err.message);
    }
  }

  const handleFilterChange = (e) => {
    const selected = e.target.value.toLowerCase(); // ✅ normalize
    setStatusFilter(selected);
    setFilterSelected(true);
  };

  const filteredTickets = employee?.tickets?.filter((ticket) =>
    statusFilter === 'all'
      ? true
      : ticket.status?.toLowerCase() === statusFilter
  ) || [];

  console.log("Status filter:", statusFilter);          
  console.log("Filtered Tickets:", filteredTickets);   

  return (
    <div className="container mt-5 fade-in">
      <div className="ticket-card shadow">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="main-heading mb-0">🎟️ My Tickets</h3>
          </div>

          {/* Filter Dropdown */}
          <div className="filter-wrapper">
            <select
              className="form-select status-filter"
              value={statusFilter}
              onChange={handleFilterChange}
            >
              <option value="">-- Select Status --</option>
              <option value="all">All</option>
              <option value="raised">Raised</option>
              <option value="cancelled">Cancelled</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {errorMsg && (
            <div className="alert alert-danger text-center">{errorMsg}</div>
          )}

          {filterSelected && employee && (
            <>
              <div className="employee-details mb-4 p-3 rounded shadow-sm bg-light border">
                <h5 className="mb-2 fw-bold">👤 Employee Details</h5>
            
                <p><strong>Name:</strong> {employee.name}</p>
                <p><strong>Email:</strong> {employee.email}</p>
              </div>

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
            </>
          )}

          {!filterSelected && !errorMsg && (
            <p className="text-center text-muted mt-4">Please select a status to view your tickets.</p>
          )}
        </div>
      </div>
    </div>
  );
}
