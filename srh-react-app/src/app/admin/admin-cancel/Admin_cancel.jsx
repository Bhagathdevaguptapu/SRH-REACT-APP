import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin_cancel.css'; // Import the CSS file

export default function Admin_cancel({ ticketId: initialTicketId, onClose, onCancelSuccess }) {
  const [ticketId, setTicketId] = useState(initialTicketId || '');
  const [cancelReason, setCancelReason] = useState('');
  const [responseMsg, setResponseMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setTicketId(initialTicketId || '');
    setCancelReason('');
    setResponseMsg('');
    setErrorMsg('');
  }, [initialTicketId]);

  async function cancelTicket() {
    if (!cancelReason) {
      setErrorMsg('Please enter cancel reason');
      return;
    }

    try {
      const response = await axios.post('/api/admin/ticket/cancel', {
        ticketId: parseInt(ticketId),
        cancelReason,
      });

      if (response.data?.status === 'success') {
        setResponseMsg(response.data.message);
        setErrorMsg('');

        // Refresh tickets data in parent
        if (onCancelSuccess) {
          await onCancelSuccess();
        }

        // Close modal after short delay
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setErrorMsg('Failed to cancel ticket');
        setResponseMsg('');
      }
    } catch (error) {
      setErrorMsg('Error occurred while cancelling the ticket.');
      setResponseMsg('');
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content fade-in">
        <h2 className="modal-title">Cancel Ticket</h2>

        <div className="form-group">
          <label>Ticket ID:</label>
          <input type="number" value={ticketId} disabled />
        </div>

        <div className="form-group">
          <label>Cancel Reason:</label>
          <input
            type="text"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Enter cancel reason"
          />
        </div>

        <button className="btn btn-primary" onClick={cancelTicket}>
          Cancel Ticket
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
