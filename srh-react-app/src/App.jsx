import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import EmpViewTickets from './app/employee/emp-view-tickets/EmpViewTickets';


function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Welcome</h2>
      <button onClick={() => navigate('/view-tickets')}>Go to View Tickets</button>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/view-tickets" element={<EmpViewTickets/>} />
      </Routes>
    </BrowserRouter>
  );
}
