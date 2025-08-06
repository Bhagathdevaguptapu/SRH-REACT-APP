import React, { useState } from 'react';
import axios from 'axios';

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('1'); // Default: IT Department

  async function fetchTickets(departmentId) {
    try {
      const response = await axios.get(`/api/department/tickets/${departmentId}`);
      if (response.data?.status?.toLowerCase() === 'success') {
        setTickets(response.data.data);
        setErrorMsg('');
      } else {
        setTickets([]);
        setErrorMsg("Failed to fetch tickets: " + response.data.message);
      }
    } catch (error) {
      console.error(error);
      setTickets([]);
      setErrorMsg("Server error while fetching tickets.");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetchTickets(selectedDepartment);
  }

  return (
    <div>
      <h2>Ticket List</h2>

      {/* Dropdown and Submit Button */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <label htmlFor="department">Select Department: </label>
        <select
          id="department"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          style={{ marginRight: '10px' }}
        >
          <option value="1">IT Department</option>
          <option value="2">Non-IT Department</option>
          <option value="3">HR Department</option>
        </select>
        <button type="submit">Submit</button>
      </form>

      {/* Error Message */}
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

      {/* Tickets Table */}
      {tickets.length > 0 && (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', marginBottom: '2rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th>Ticket ID</th>
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
            {tickets.map(ticket => (
              <React.Fragment key={ticket.ticketId}>
                <tr>
                  <td>{ticket.ticketId}</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.description}</td>
                  <td>{ticket.status}</td>
                  <td>{ticket.cancelReason || 'N/A'}</td>
                  <td>{ticket.closeReason || 'N/A'}</td>
                  <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                  <td>{new Date(ticket.updatedAt).toLocaleString()}</td>
                </tr>

                {/* Nested Comments */}
                {ticket.comments?.length > 0 && (
                  <tr>
                    <td colSpan="8">
                      <strong>Comments:</strong>
                      <table border="1" cellPadding="6" cellSpacing="0" style={{ width: '100%', marginTop: '10px' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#e0e0e0' }}>
                            <th>Comment ID</th>
                            <th>Commenter Role</th>
                            <th>Commenter Name</th>
                            <th>Comment Text</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ticket.comments.map(comment => (
                            <tr key={comment.commentId}>
                              <td>{comment.commentId}</td>
                              <td>{comment.commenterRole}</td>
                              <td>{comment.commenterName}</td>
                              <td>{comment.commentText}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
