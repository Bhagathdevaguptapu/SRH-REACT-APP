import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admin_emp_tickets.css";
import AdminLayout from "../admin-layout/AdminLayout";

export default function Admin_emp_tickets() {
  const [ticketsData, setTicketsData] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    axios
      .get("/api/admin/employees/tickets")
      .then((response) => {
        if (response.data.status === "success") {
          setTicketsData(response.data.data);
        } else {
          setErrorMsg(response.data.message || "Something went wrong");
        }
      })
      .catch(() => {
        setErrorMsg("Failed to fetch employee tickets");
      });
  }, []);

  const allTickets = ticketsData.flatMap((emp) =>
    emp.tickets.map((ticket) => ({
      ...ticket,
      employeeName: emp.name,
      employeeId: emp.employeeId,
    }))
  );

  const filteredTickets = allTickets
    .filter((ticket) => statusFilter === "ALL" || ticket.status === statusFilter)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (errorMsg !== "") {
    return (
      <div className="container mt-4 fade-in">
        <div className="alert alert-danger text-center">{errorMsg}</div>
      </div>
    );
  }

  const handleAssign = (ticketId) => {
    alert(`Assign ticket: ${ticketId}`);
    // TODO: Implement modal or API call here
  };

  const handleCancel = (ticketId) => {
    alert(`Cancel ticket: ${ticketId}`);
    // TODO: Implement modal or API call here
  };

  return (
    <AdminLayout>
      <div className="container mt-5 fade-in">
        <div className="ticket-card shadow">
          <div className="card-body">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
              <h3 className="main-heading mb-2">🎫 Employee Tickets</h3>
              <select
                className="form-select status-filter small-dropdown"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All</option>
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="table-responsive">
              <table className="table custom-table table-hover align-middle">
                <thead className="table-dark text-center">
                  <tr>
                    <th>Employee Name</th>
                    <th>Employee ID</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Created At</th>
                    <th>Department (ID)</th>
                    <th>Status</th>
                    <th>Updated At</th>
                    <th>Cancel Reason</th>
                    <th>Close Reason</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket, index) => (
                      <tr key={index} className="hover-row text-center">
                        <td>{ticket.employeeName}</td>
                        <td>{ticket.employeeId}</td>
                        <td>{ticket.title}</td>
                        <td>{ticket.description}</td>
                        <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                        <td>
                          {ticket.assignedToDepartmentName} ({ticket.assignedToDepartment})
                        </td>
                        <td>
                          <span
                            className={`badge 
                              ${
                                ticket.status === "OPEN"
                                  ? "bg-warning text-dark"
                                  : ticket.status === "CLOSED"
                                  ? "bg-success"
                                  : ticket.status === "CANCELLED"
                                  ? "bg-danger"
                                  : "bg-secondary"
                              }`}
                          >
                            {ticket.status}
                          </span>
                        </td>
                        <td>{new Date(ticket.updatedAt).toLocaleString()}</td>
                        <td>{ticket.cancelReason || "-"}</td>
                        <td>{ticket.closeReason || "-"}</td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleAssign(ticket.ticketId)}
                            >
                              Assign
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleCancel(ticket.ticketId)}
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="text-center text-muted">
                        No tickets found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
