import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RaiseTickets.css';
import EmpLayout from '../emp-layout/EmpLayout';

export default function RaiseTicket() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const storedId = localStorage.getItem('employeeId');
    if (storedId) {
      setEmployeeId(storedId);
    } else {
      setStatus('error');
      setMessage('Employee ID not found. Please login again.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dto = {
      title,
      description,
      employeeId
    };

    try {
      const response = await axios.post('/api/emp/raiseTicket', dto);

      if (response.data?.status === 'success') {
        setMessage(response.data.message);
        setStatus('success');
        setTitle('');
        setDescription('');
      } else {
        setMessage(response.data.message || 'Failed to raise ticket.');
        setStatus('failed');
      }
    } catch (error) {
      setMessage('Error while raising ticket.');
      setStatus('error');
      console.error(error);
    }
  };

  return (
    <EmpLayout>
      <div className="raise-ticket-card fade-in">
        <h2>Raise a Ticket</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title*</label>
            <input
              type="text"
              value={title}
              placeholder="Should not be null"
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Description*</label>
            <textarea
              rows="4"
              value={description}
              placeholder="Write detailed description of your issue"
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" disabled={!employeeId}>Submit Ticket</button>
        </form>

        {status && (
          <div className={`message ${status}`}>
            {message}
          </div>
        )}
      </div>
    </EmpLayout>
  );
}
