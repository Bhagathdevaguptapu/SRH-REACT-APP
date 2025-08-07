import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('1'); // Default: IT

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

  return (
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
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>S.No</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Cancel Reason</th>
                  <th>Close Reason</th>
                  <th>Created At</th>
                  <th>Updated At</th>
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
                        <span className={`badge bg-${ticket.status === 'Open' ? 'success' : 'secondary'}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td>{ticket.cancelReason || 'N/A'}</td>
                      <td>{ticket.closeReason || 'N/A'}</td>
                      <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                      <td>{new Date(ticket.updatedAt).toLocaleString()}</td>
                    </tr>

                    {/* Comments Section */}
                    {ticket.comments?.length > 0 && (
                      <tr className="table-secondary">
                        <td colSpan="8">
                          <strong>Comments:</strong>
                          <div className="table-responsive mt-2">
                            <table className="table table-sm table-bordered mb-0">
                              <thead className="table-light">
                                <tr>
                                  <th>Commenter Name</th>
                                  <th>Comment Text</th>
                                </tr>
                              </thead>
                              <tbody>
                                {ticket.comments.map((comment) => (
                                  <tr key={comment.commentId}>
                                    <td>{comment.commenterName}</td>
                                    <td>{comment.commentText}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
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
  );
}
