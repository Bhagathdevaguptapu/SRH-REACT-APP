import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function TicketComment() {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [commenterName, setCommenterName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [departmentTickets, setDepartmentTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchDepartmentTickets = (deptId) => {
    const departmentId = deptId || selectedDepartmentId;

    setTicketId('');
    setDepartmentTickets([]);
    setSuccessMsg('');
    setErrorMsg('');
    setIsError(false);

    if (!departmentId) {
      setIsError(true);
      setErrorMsg('Please select a valid department.');
      return;
    }

    setLoading(true);

    axios
      .get(`/api/department/tickets/${departmentId}`)
      .then((resp) => {
        setLoading(false);
        if (resp.data.status === 'success') {
          setDepartmentTickets(resp.data.data);
          if (resp.data.data.length === 0) {
            setIsError(true);
            setErrorMsg('No tickets found for the selected department.');
          }
        } else {
          setIsError(true);
          setErrorMsg(resp.data.message || 'Failed to fetch tickets.');
        }
      })
      .catch(() => {
        setLoading(false);
        setIsError(true);
        setErrorMsg('Server error occurred while fetching tickets.');
      });
  };

  const submitComment = () => {
    setIsError(false);
    setSuccessMsg('');

    if (!ticketId || !commenterName.trim() || !commentText.trim()) {
      setIsError(true);
      setErrorMsg('All fields are required.');
      return;
    }

    setLoading(true);

    const payload = {
      ticketId: parseInt(ticketId),
      commenterName: commenterName.trim(),
      commentText: commentText.trim(),
    };

    axios
      .post('/api/department/ticket/comment', payload)
      .then((resp) => {
        setLoading(false);
        if (resp.data.status === 'success') {
          setSuccessMsg(resp.data.message || 'Comment added successfully!');
          setTicketId('');
          setCommenterName('');
          setCommentText('');
        } else {
          setIsError(true);
          setErrorMsg(resp.data.message || 'Failed to submit comment.');
        }
      })
      .catch(() => {
        setLoading(false);
        setIsError(true);
        setErrorMsg('Server error occurred while submitting comment.');
      });
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Add Comment to Ticket</h2>

      <div className="card p-4 shadow">
        <div className="mb-3">
          <label htmlFor="deptId" className="form-label">Select Department</label>
          <select
            id="deptId"
            className="form-select"
            value={selectedDepartmentId}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedDepartmentId(val);
              fetchDepartmentTickets(val);
            }}
          >
            <option value="">Select Department</option>
            <option value="1">IT Support</option>
            <option value="2">Non IT Support</option>
            <option value="3">HR Support</option>
          </select>
        </div>

        {departmentTickets.length > 0 && (
          <div className="mb-3">
            <label htmlFor="ticketId" className="form-label">Select Ticket</label>
            <select
              id="ticketId"
              className="form-select"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
            >
              <option value="">Select Ticket</option>
              {departmentTickets.map((t) => (
                <option key={t.ticketId} value={t.ticketId}>
                  {t.ticketId} - {t.subject || t.description?.slice(0, 30)}...
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="commenterName" className="form-label">Your Name</label>
          <input
            type="text"
            id="commenterName"
            className="form-control"
            value={commenterName}
            onChange={(e) => setCommenterName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="commentText" className="form-label">Comment</label>
          <textarea
            id="commentText"
            className="form-control"
            rows="3"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          ></textarea>
        </div>

        <button
          className="btn btn-primary"
          onClick={submitComment}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Comment'}
        </button>

        {/* Feedback messages */}
        {isError && <div className="alert alert-danger mt-3">{errorMsg}</div>}
        {successMsg && <div className="alert alert-success mt-3">{successMsg}</div>}
      </div>
    </div>
  );
}
