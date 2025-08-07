import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import EmpViewTickets from './app/employee/emp-view-tickets/EmpViewTickets';
import RaiseTickets from './app/employee/raise-ticket/RaiseTickets'; 
import EmpCancel from './app/employee/emp-cancel/EmpCancel';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Make sure this line imports your new CSS
import EmpFeedBack from './app/employee/emp-feedback/EmpFeedBack';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <h2 className="mb-4">🎉 Welcome</h2>
      <div className="d-flex flex-column gap-3" style={{ maxWidth: "300px", margin: "0 auto" }}>
        <Button className="shadow-sm" variant="outline-primary" onClick={() => navigate('/view-tickets')}>
          View Your Tickets
        </Button>
        <Button className="shadow-sm" variant="outline-success" onClick={() => navigate('/raise-ticket')}>
          Raise a Ticket
        </Button>
        <Button className="shadow-sm" variant="outline-danger" onClick={() => navigate('/cancel-ticket')}>
          Cancel Your Ticket
        </Button>
        <Button className="shadow-sm" variant="outline-success" onClick={() => navigate('/emp-feedBack')}>
          Give Feedback
        </Button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/view-tickets" element={<EmpViewTickets />} />
        <Route path="/raise-ticket" element={<RaiseTickets />} />
        <Route path="/cancel-ticket" element={<EmpCancel />} />
        <Route path="/emp-feedBack" element={<EmpFeedBack />} />
      </Routes>
    </BrowserRouter>
  );
}
