import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';

export default function Login() {
  const [modalVisible, setModalVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    role: 'department'
  });
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const openInfo = () => setInfoVisible(true);
  const closeInfo = () => setInfoVisible(false);

  const resetForm = () => {
    setLoginData({ email: '', password: '', role: 'department' });
    setErrorMsg('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await axios.post('/api/department/login', loginData); // Adjust API endpoint
      const res = response.data;

      if (res?.status === 'success') {
        // Save role/session info here
        localStorage.setItem('role', loginData.role);

        if (loginData.role === 'employee') {
          const empId = res.id;
          if (empId) {
            localStorage.setItem('employeeId', empId.toString());
            navigate('/home');
            closeModal();
          } else {
            setErrorMsg('Employee ID not found.');
          }
        } else if (loginData.role === 'admin') {
          navigate('/admin-home');
          closeModal();
        } else if (loginData.role === 'department') {
          navigate('/');
          closeModal();
        } else {
          setErrorMsg('Invalid role.');
        }
      } else {
        setErrorMsg(res.message || 'Invalid login.');
      }
    } catch (error) {
      setErrorMsg('Login failed. Please try again.');
    }
  };

  return (
    <>
      <div className={`login-container ${modalVisible || infoVisible ? 'login-blur-background' : ''}`}>
        <div className="login-left-pane">
          <h1>
            Service <span className="login-orange">Request</span> Handling
          </h1>
          <p>
            Welcome to the Service Request Handling system. Streamline your requests efficiently and stay connected.
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              className="login-btn-login"
              onClick={openModal}
              aria-haspopup="dialog"
              aria-controls="loginModal"
            >
              Login
            </button>
            <button
              className="login-btn-info"
              onClick={openInfo}
              aria-haspopup="dialog"
              aria-controls="infoModal"
              style={{ backgroundColor: '#007BFF', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
            >
              Info
            </button>
          </div>
        </div>
        <div className="login-right-pane" />
      </div>

      {/* Login Modal */}
      {modalVisible && (
        <div
          className="login-modal-overlay show"
          id="loginModal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitle"
          tabIndex="-1"
        >
          <div className="login-card" role="document">
            <button
              onClick={closeModal}
              className="login-close-btn"
              aria-label="Close Login Form"
              id="closeModalBtn"
            >
              &times;
            </button>
            <h2 id="modalTitle">🔐 Login</h2>

            <form onSubmit={handleSubmit} id="loginForm" noValidate>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                required
              />
              {loginData.email === '' && (
                <div className="login-error-text">Email is required.</div>
              )}

              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                required
              />
              {loginData.password === '' && (
                <div className="login-error-text">Password is required.</div>
              )}

              <label htmlFor="role">Role:</label>
              <select
                id="role"
                name="role"
                value={loginData.role}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
                <option value="department">Department</option>
              </select>
              {loginData.role === '' && (
                <div className="login-error-text">Please select a role.</div>
              )}

              <div className="login-actions">
                <button
                  type="submit"
                  disabled={!loginData.email || !loginData.password || !loginData.role}
                >
                  Submit
                </button>
                <button type="button" onClick={resetForm}>
                  Reset
                </button>
              </div>
            </form>

            {errorMsg && (
              <p className="login-error-text login-error-msg">
                {errorMsg}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Info Modal */}
      {infoVisible && (
        <div
          className="login-modal-overlay show"
          id="infoModal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="infoModalTitle"
          tabIndex="-1"
          style={{ overflowY: 'auto' }}
        >
          <div className="login-card" role="document" style={{ maxWidth: '700px' }}>
            <button
              onClick={closeInfo}
              className="login-close-btn"
              aria-label="Close Info Modal"
              id="closeInfoBtn"
            >
              &times;
            </button>
            <h2 id="infoModalTitle">🛠️ Service Request Handling System</h2>

            <section style={{ marginBottom: '1rem' }}>
              <h3>Developed by:</h3>
              <ul>
                <li><strong>Admin Module:</strong> K Manikanta Reddy</li>
                <li><strong>Employee Module:</strong> M Lahari</li>
                <li><strong>Department Module:</strong> D Bhagath Krishna Vamsi</li>
              </ul>
            </section>

            <section style={{ marginBottom: '1rem' }}>
              <h3>📖 Project Overview</h3>
              <p>
                The Service Request Handling System is a centralized platform that enables employees to raise service tickets, admins to assign and manage them, and departments to act on those tickets. The system supports:
              </p>
              <ul>
                <li>Ticket creation, tracking, and cancellation by employees</li>
                <li>Ticket assignment and oversight by admins</li>
                <li>Ticket resolution, commenting, and closing by departments</li>
              </ul>
              <p>
                This microservice-style project promotes modular responsibility with secure login for different user roles.
              </p>
            </section>

            <section style={{ marginBottom: '1rem' }}>
              <h3>⚙️ Modules & Responsibilities</h3>
              <h4>🧑‍💼 Employee Module (Lahari)</h4>
              <ul>
                <li>Login</li>
                <li>Raise a service request</li>
                <li>View my tickets</li>
                <li>Cancel my ticket</li>
                <li>Provide feedback on resolved ticket</li>
              </ul>
              <h4>🧑‍💻 Department Module (Bhagath)</h4>
              <ul>
                <li>View assigned tickets</li>
                <li>Accept ticket</li>
                <li>Update ticket status</li>
                <li>Comment on tickets</li>
                <li>Close tickets with reason</li>
              </ul>
              <h4>👨‍💼 Admin Module (Manikanta)</h4>
              <ul>
                <li>Admin login</li>
                <li>View all employee tickets</li>
                <li>View tickets by employee</li>
                <li>Assign ticket to department</li>
                <li>Cancel any ticket on behalf of user</li>
              </ul>
            </section>

           
          </div>
        </div>
      )}
    </>
  );
}
