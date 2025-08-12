import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EmpDash from './app/employee/emp-dashboard/EmpDash';
import EmpViewTickets from './app/employee/emp-view-tickets/EmpViewTickets';
import RaiseTickets from './app/employee/raise-ticket/RaiseTickets';
import EmpCancel from './app/employee/emp-cancel/EmpCancel';
import EmpFeedBack from './app/employee/emp-feedback/EmpFeedBack';
import EmpLayout from './app/employee/emp-layout/EmpLayout';
import Login from './app/employee/login/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/emp-dash"   element={<EmpDash/>}/>
          <Route path="/emp-layout" element={<EmpLayout/>}/>
          <Route path="/view-tickets" element={<EmpViewTickets />} />
          <Route path="/raise-ticket" element={<RaiseTickets />} />
          <Route path="/cancel-ticket" element={<EmpCancel />} />
          <Route path="/emp-feedBack" element={<EmpFeedBack />} />
     
      </Routes>
    </BrowserRouter>
  );
}

export default App;
