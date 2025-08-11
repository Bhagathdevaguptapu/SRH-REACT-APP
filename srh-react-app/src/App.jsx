import "bootstrap/dist/css/bootstrap.min.css";
import Admin_cancel from "./app/admin/admin-cancel/Admin_cancel";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Admin_emp_tickets from "./app/admin/admin-emp_tickets/Admin_emp_tickets";
import Admin_emp_feedback from "./app/admin/admin-emp-feedback/Admin_emp_feedback";
import Admin_dashboard from "./app/admin/admin-dashboard/Admin_dashboard";
import Admin_assign from "./app/admin/admin-assign/Admin_assign";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/admin_emp_tickets" element={<Admin_emp_tickets />} />
          <Route path="/admin_emp_feedbacks" element={<Admin_emp_feedback/>}/>
          <Route path="/admin_dashboard" element={<Admin_dashboard/>}/>
          <Route path="/admin_assign" element={<Admin_assign/>}/>
          <Route path="/admin_cancel" element={<Admin_cancel/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;