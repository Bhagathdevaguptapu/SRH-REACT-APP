import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EmpFeedback.css';
import EmpLayout from '../emp-layout/EmpLayout';

export default function EmpFeedback() {
  const [employee, setEmployee] = useState(null);
  const [closedTickets, setClosedTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [employeeId, setEmployeeId] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem('employeeId');
    if (storedId) {
      setEmployeeId(storedId);
    } else {
      setErrorMsg('Employee ID not found. Please log in again.');
    }
  }, []);

  useEffect(() => {
    if (employeeId) {
      fetchClosedTickets(employeeId);
    }
  }, [employeeId]);

  const fetchClosedTickets = async (empId) => {
    try {
      const resp = await axios.get(`/api/emp/viewMyTickets/${empId}`);
      if (resp.data?.status === 'success') {
        const emp = resp.data.data;
        setEmployee(emp);

        const closed = emp.tickets.filter(
          (ticket) => ticket.status?.toLowerCase() === 'closed'
        );

        setClosedTickets(closed);
      } else {
        setErrorMsg(resp.data.message || 'Could not fetch tickets');
      }
    } catch (err) {
      setErrorMsg('Server Error: ' + err.message);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedTicketId || !feedbackText.trim()) {
      setStatusMessage('Please select a ticket and enter feedback.');
      return;
    }

    try {
      const response = await axios.post('/api/emp/giveFeedback', {
        ticketId: selectedTicketId,
        feedbackText: feedbackText,
      });

      if (response.data.status === 'success') {
        setStatusMessage('✅ Feedback submitted successfully!');
        setFeedbackText('');
        setSelectedTicketId('');
        fetchClosedTickets(employeeId); // Refresh list after feedback
      } else {
        setStatusMessage(response.data.message || 'Failed to submit feedback.');
      }
    } catch (err) {
      setStatusMessage('Error while submitting feedback.');
    }
  };

  return (
    <EmpLayout>
      <div className="container mt-5 fade-in">
        <div className="feedback-card shadow-lg rounded bg-light">
          <h3>Give Feedback</h3>

          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

          {closedTickets.length === 0 ? (
            <div className="alert alert-info">
              No closed tickets available for feedback.
            </div>
          ) : (
            <form>
              {/* Select Ticket */}
              <div className="form-group">
                <label className="form-label">Select Closed Ticket</label>
                <select
                  className="form-select"
                  value={selectedTicketId}
                  onChange={(e) => setSelectedTicketId(e.target.value)}
                >
                  <option value="">-- Select Ticket --</option>
                  {closedTickets.map((ticket) => (
                    <option key={ticket.ticketId} value={ticket.ticketId}>
                      #{ticket.ticketId} - {ticket.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Feedback Textarea */}
              {selectedTicketId && (
                <>
                  <div className="form-group">
                    <label className="form-label">Your Feedback</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Write your feedback here..."
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="d-flex justify-content-center">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSubmitFeedback}
                    >
                      Submit Feedback
                    </button>
                  </div>
                </>
              )}

              {/* Status Message */}
              {statusMessage && (
                <div className="alert alert-info mt-3">{statusMessage}</div>
              )}
            </form>
          )}
        </div>
      </div>
    </EmpLayout>
  );
}
