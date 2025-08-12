import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import DepartmentLayout from '../departmentLayout/DepartmentLayout';

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('1'); // Default: IT
  const [expandedTicketIds, setExpandedTicketIds] = useState(new Set());

  const fetchTickets = (departmentId) => {
    axios.get(`/api/department/tickets/${departmentId}`)
      .then((response) => {
        if (response.data?.status?.toLowerCase() === 'success') {
          setTickets(response.data.data);
          setErrorMsg('');
        } else {
          setTickets([]);
          setErrorMsg('Failed to fetch tickets: ' + response.data.message);
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setTickets([]);
        setErrorMsg('Server error while fetching tickets.');
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTickets(selectedDepartment);
  };

  // Toggle expand/collapse comments for a ticket
  const toggleComments = (ticketId) => {
    const newSet = new Set(expandedTicketIds);
    if (newSet.has(ticketId)) {
      newSet.delete(ticketId);
    } else {
      newSet.add(ticketId);
    }
    setExpandedTicketIds(newSet);
  };

  // Function to get badge color based on status
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'open': return 'success';
      case 'closed': return 'danger';
      case 'in progress': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <DepartmentLayout>
      <div className="container my-5">
        <div className="card shadow-sm p-4">
          <h2 className="mb-4 text-primary">Ticket List</h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="row g-3 align-items-end mb-4">
            <div className="col-md-4">
              <label htmlFor="department" className="form-label">Select Department</label>
              <select
                id="department"
                className="form-select"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="1">IT Department</option>
                <option value="2">Non-IT Department</option>
                <option value="3">HR Department</option>
              </select>
            </div>
            <div className="col-md-auto">
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </form>

          {/* Error Message */}
          {errorMsg && (
            <div className="alert alert-danger" role="alert">
              {errorMsg}
            </div>
          )}

          {/* Tickets Table */}
          {tickets.length > 0 && (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>S.No</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Cancel Reason</th>
                    <th>Close Reason</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket, index) => (
                    <React.Fragment key={ticket.ticketId}>
                      <tr>
                        <td>{index + 1}</td>
                        <td>{ticket.title}</td>
                        <td>{ticket.description}</td>
                        <td>
                          <span className={`badge bg-${getStatusBadge(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td>{ticket.cancelReason || 'N/A'}</td>
                        <td>{ticket.closeReason || 'N/A'}</td>
                        <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                        <td>{new Date(ticket.updatedAt).toLocaleString()}</td>
                        <td>
                          {ticket.comments?.length > 0 ? (
                            <button
                              className="btn btn-sm btn-outline-info"
                              onClick={() => toggleComments(ticket.ticketId)}
                              aria-expanded={expandedTicketIds.has(ticket.ticketId)}
                              aria-controls={`comments-${ticket.ticketId}`}
                            >
                              {expandedTicketIds.has(ticket.ticketId) ? 'Hide' : 'Show'} Comments ({ticket.comments.length})
                            </button>
                          ) : (
                            <span className="text-muted">No Comments</span>
                          )}
                        </td>
                      </tr>

                      {/* Comments Section */}
                      {expandedTicketIds.has(ticket.ticketId) && ticket.comments?.length > 0 && (
                        <tr id={`comments-${ticket.ticketId}`} className="table-light">
                          <td colSpan="9">
                            <div className="p-3 border rounded">
                              <h6>Comments:</h6>
                              <ul className="list-group list-group-flush">
                                {ticket.comments.map((comment) => (
                                  <li key={comment.commentId} className="list-group-item">
                                    <strong>{comment.commenterName}</strong>: {comment.commentText}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DepartmentLayout>
  );
}
