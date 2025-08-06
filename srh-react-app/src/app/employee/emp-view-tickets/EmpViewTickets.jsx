import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function EmpViewTickets() {
  const [employee, setEmployee] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const employeeId = 100;

  useEffect(() => {
    fetchEmployeeTickets();
  }, []);

  async function fetchEmployeeTickets() {
    await axios.get(`/api/emp/viewMyTickets/${employeeId}`)
      .then(resp => {
        if (resp.data?.status === 'success') {
          setEmployee(resp.data?.data);
        } else {
          setErrorMsg(resp.data?.message || "Failed to load tickets");
        }
      })
      .catch(err => {
        setErrorMsg("Server error: " + err.message);
      });
  }

  return (
    <div>
      <h2>My Tickets</h2>

      {errorMsg && <p>{errorMsg}</p>}

      {employee ? (
        <div>
          <h3>Employee Details</h3>
          <p>ID: {employee.employeeId}</p>
          <p>Name: {employee.name}</p>
          <p>Email: {employee.email}</p>

          <h4>Tickets</h4>
          {employee.tickets && employee.tickets.length > 0 ? (
            <ul>
              {employee.tickets.map(ticket => (
                <li key={ticket.ticketId}>
                  <p>Title: {ticket.title}</p>
                  <p>Description: {ticket.description}</p>
                  <p>Status: {ticket.status}</p>
                  <p>Comment: {ticket.commentText || 'No comment'}</p>
                  <p>Commenter Name: {ticket.commenterName || 'N/A'}</p>
                  <p>Role: {ticket.commenterRole || 'N/A'}</p>
                  <hr />
                </li>
              ))}
            </ul>
          ) : (
            <p>No tickets found.</p>
          )}
        </div>
      ) : (
        !errorMsg && <p>Loading...</p>
      )}
    </div>
  );
}
