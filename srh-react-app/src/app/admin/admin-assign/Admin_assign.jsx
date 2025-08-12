import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin_assign.css';


export default function Admin_assign({ ticketId: initialTicketId, onClose, onAssignSuccess }) {
  const [ticketId, setTicketId] = useState(initialTicketId || '');
  const [departmentId, setDepartmentId] = useState('');
  const [responseMsg, setResponseMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setTicketId(initialTicketId || '');
    setDepartmentId('');
    setResponseMsg('');
    setErrorMsg('');
  }, [initialTicketId]);

  async function assignTicket() {
    if (!departmentId) {
      setErrorMsg('Please select a Department');
      return;
    }

    try {
      const response = await axios.post('/api/admin/assign-ticket', {
        ticketId: parseInt(ticketId),
        departmentId: parseInt(departmentId),
      });

      if (response.data?.status === 'success') {
        setResponseMsg(response.data.message);
        setErrorMsg('');

        if (onAssignSuccess) {
          await onAssignSuccess();
        }

        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setErrorMsg(response.data?.message || 'Failed to assign ticket');
        setResponseMsg('');
      }
    } catch (error) {
      setErrorMsg('Error occurred while assigning the ticket.');
      setResponseMsg('');
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content fade-in">
        <h2 className="modal-title">Assign Ticket to Department</h2>

        <div className="form-group">
          <label>Ticket ID:</label>
          <input type="number" value={ticketId} disabled />
        </div>

        <div className="form-group">
          <label>Department:</label>
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
          >
            <option value="">-- Select Department --</option>
            <option value="1">IT Department</option>
            <option value="2">Non IT Department</option>
            <option value="3">HR and Finance</option>
          </select>
        </div>

        <button className="btn btn-primary" onClick={assignTicket}>
          Assign Ticket
        </button>
        <br />

        <button className="btn btn-danger" onClick={onClose}>
          Close
        </button>

        {responseMsg && <p className="success-msg">{responseMsg}</p>}
        {errorMsg && <p className="error-msg">{errorMsg}</p>}
      </div>
    </div>
  );
}
