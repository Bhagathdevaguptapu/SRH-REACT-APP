import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Admin_emp_feedback.css'; // Import the CSS file
import AdminLayout from '../admin-layout/AdminLayout';

export default function Admin_emp_feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get('/api/admin/feedbacks');
      if (response.data.status === 'success') {
        setFeedbacks(response.data.data);
        setError('');
      } else {
        setError(response.data.message || 'Failed to fetch feedbacks.');
      }
    } catch (err) {
      console.error(err);
      setError('Server error while fetching feedbacks.');
    }
  };

  return (
    <AdminLayout>
    <div className="admin-feedback-container">
      <h2>Employee Feedbacks</h2>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <table className="feedback-table" border="0">
          <thead>
            <tr>
              <th>Ticket Title</th>
              <th>Feedback</th>
              <th>Given By (Employee)</th>
              <th>Given At</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.length > 0 ? (
              feedbacks.map((fb) => (
                <tr key={fb.feedbackId}>
                  <td>{fb.ticketTitle || 'N/A'}</td>
                  <td>{fb.feedbackText}</td>
                  <td>{fb.employeeName || `ID: ${fb.employeeId}`}</td>
                  <td>{new Date(fb.givenAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ fontStyle: 'italic', color: '#888' }}>
                  No feedbacks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
    </AdminLayout>
  );
}
