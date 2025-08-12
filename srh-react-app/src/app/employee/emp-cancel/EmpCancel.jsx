import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './EmpCancel.css'; 
import EmpLayout from '../emp-layout/EmpLayout';

export default function CancelTicket() {
  const [tickets, setTickets] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [employeeId, setEmployeeId] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem('employeeId');
    if (storedId) {
      setEmployeeId(storedId);
    } else {
      setErrorMsg('Employee ID not found. Please login again.');
    }
  }, []);

  useEffect(() => {
    if (employeeId) {
      fetchTickets(employeeId);
    }
  }, [employeeId]);

  async function fetchTickets(empId) {
    try {
      const resp = await axios.get(`/api/emp/viewMyTickets/${empId}`);
      if (resp.data?.status === 'success') {
        const raisedTickets = resp.data.data.tickets.filter(
          ticket => ticket.status?.toLowerCase() === 'raised'
        );
        setTickets(raisedTickets);
      } else {
        setErrorMsg(resp.data?.message || 'No tickets found');
      }
    } catch (error) {
      setErrorMsg('Server Error: ' + error.message);
    }
  }

  async function cancelTicket(ticketId) {
    try {
      const resp = await axios.post(`/api/emp/cancelMyTicket/${ticketId}`);
      if (resp.data?.status === 'success') {
        setTickets(prev => prev.filter(ticket => ticket.ticketId !== ticketId));
      } else {
        alert(resp.data?.message || 'Failed to cancel ticket');
      }
    } catch (error) {
      alert('Server Error: ' + error.message);
    }
  }

  return (
    <EmpLayout>
      <div className="container mt-5 fade-in">
        <div className="ticket-card shadow">
          <div className="card-body">
            <h3 className="main-heading mb-4">🛑 Cancel My Raised Tickets</h3>

            {/* Error Message */}
            {errorMsg && (
              <div className="alert-message">
                <strong>Error:</strong> {errorMsg}
              </div>
            )}

            {/* Table */}
            <div className="table-responsive">
              <table className="table custom-table table-hover align-middle">
                <thead className="table-dark text-center">
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.length > 0 ? (
                    tickets.map((ticket, index) => (
                      <tr key={index} className="hover-row text-center">
                        <td>{ticket.title}</td>
                        <td>{ticket.description}</td>
                        <td>
                          <span className="badge badge-raised">
                            {ticket.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn-cancel"
                            onClick={() => cancelTicket(ticket.ticketId)}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        No raised tickets available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </EmpLayout>
  );
}
