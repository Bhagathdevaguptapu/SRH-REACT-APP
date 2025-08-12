import "bootstrap/dist/css/bootstrap.min.css";
import Admin_cancel from "./app/admin/admin-cancel/Admin_cancel";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Admin_emp_tickets from "./app/admin/admin-emp_tickets/Admin_emp_tickets";
import Admin_emp_feedback from "./app/admin/admin-emp-feedback/Admin_emp_feedback";
import Admin_dashboard from "./app/admin/admin-dashboard/Admin_dashboard";
import Admin_assign from "./app/admin/admin-assign/Admin_assign";
import EmpDash from "./app/employee/emp-dashboard/EmpDash";
import EmpLayout from "./app/employee/emp-layout/EmpLayout";
import EmpViewTickets from "./app/employee/emp-view-tickets/EmpViewTickets";
import RaiseTickets from "./app/employee/raise-ticket/RaiseTickets";
import EmpCancel from "./app/employee/emp-cancel/EmpCancel";
import EmpFeedBack from "./app/employee/emp-feedback/EmpFeedBack";
import Login from "./app/employee/login/Login";
import TicketList from './app/department/ticket-list/ticketList'
import TicketComment from './app/department/ticket-comment/ticketComment'
import TicketStatus from './app/department/ticket-status/ticketStatus'
import TicketWork from './app/department/ticket-work/ticketWork'
import Home from './app/department/Home/home'
import DigitalStatsDashboard from './app/department/digitalStatsDashboard/DigitalStatsDashboard'



function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/emp-dash" element={<EmpDash />} />
          <Route path="/emp-layout" element={<EmpLayout />} />
          <Route path="/view-tickets" element={<EmpViewTickets />} />
          <Route path="/raise-ticket" element={<RaiseTickets />} />
          <Route path="/cancel-ticket" element={<EmpCancel />} />
          <Route path="/emp-feedBack" element={<EmpFeedBack />} />
          <Route path="/admin_emp_tickets" element={<Admin_emp_tickets />} />
          <Route path="/admin_emp_feedbacks" element={<Admin_emp_feedback />} />
          <Route path="/admin_dashboard" element={<Admin_dashboard />} />
          <Route path="/admin_assign" element={<Admin_assign />} />
          <Route path="/admin_cancel" element={<Admin_cancel />} />
          <Route path="/dept-home" element={<Home />} />
          <Route path="/digitalStatsDashboard" element={<DigitalStatsDashboard />} />
          <Route path="/ticketList" element={<TicketList />} />
          <Route path="/ticketStatus" element={<TicketStatus />} />
          <Route path="/ticketWork" element={<TicketWork />} />
          <Route path='/ticketComment' element={<TicketComment />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;