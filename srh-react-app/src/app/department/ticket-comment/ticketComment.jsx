import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import DepartmentLayout from '../departmentLayout/DepartmentLayout';

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
    <DepartmentLayout>
      <div className="bg-light min-vh-100 d-flex align-items-center py-5">
        <div className="container">
          <div className="card shadow rounded-lg mx-auto" style={{ maxWidth: '700px' }}>
            <div className="card-body p-5">
              <h3 className="card-title text-center mb-4 fw-bold text-primary">
                Add Comment to Ticket
              </h3>

              {/* Department selector */}
              <div className="mb-4">
                <label htmlFor="deptId" className="form-label fw-semibold">
                  Department
                </label>
                <select
                  id="deptId"
                  className="form-select"
                  value={selectedDepartmentId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedDepartmentId(val);
                    fetchDepartmentTickets(val);
                  }}
                  disabled={loading}
                >
                  <option value="" disabled>
                    -- Select Department --
                  </option>
                  <option value="1">IT Support</option>
                  <option value="2">Non IT Support</option>
                  <option value="3">HR Support</option>
                </select>
              </div>

              {/* Ticket and Name side by side */}
              <div className="row g-3 mb-4">
                <div className="col-md-7">
                  <label htmlFor="ticketId" className="form-label fw-semibold">
                    Ticket
                  </label>
                  <select
                    id="ticketId"
                    className="form-select"
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value)}
                    disabled={loading}
                  >
                    <option value="" disabled>
                      -- Select Ticket --
                    </option>
                    {departmentTickets.map((t) => (
                      <option key={t.ticketId} value={t.ticketId}>
                        {t.ticketId} - {t.subject || t.description?.slice(0, 40)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-5">
                  <label htmlFor="commenterName" className="form-label fw-semibold">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="commenterName"
                    className="form-control"
                    value={commenterName}
                    onChange={(e) => setCommenterName(e.target.value)}
                    disabled={loading}
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              {/* Comment textarea */}
              <div className="mb-4">
                <label htmlFor="commentText" className="form-label fw-semibold">
                  Comment
                </label>
                <textarea
                  id="commentText"
                  className="form-control"
                  rows="5"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={loading}
                  placeholder="Write your comment here..."
                  style={{ resize: 'vertical' }}
                ></textarea>
              </div>

              {/* Feedback alerts */}
              {isError && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {errorMsg}
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setIsError(false)}
                  ></button>
                </div>
              )}

              {successMsg && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  {successMsg}
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setSuccessMsg('')}
                  ></button>
                </div>
              )}

              {/* Submit button */}
              <div className="d-grid mt-4">
                <button
                  className="btn btn-primary btn-lg shadow"
                  onClick={submitComment}
                  disabled={loading}
                  type="button"
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Submitting...
                    </>
                  ) : (
                    'Submit Comment'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DepartmentLayout>
  );
}
