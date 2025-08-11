import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admin_emp_tickets.css";
import AdminLayout from "../admin-layout/AdminLayout";
import Admin_cancel from "../admin-cancel/Admin_cancel";
import Admin_assign from "../admin-assign/Admin_assign";

import {
  FaIdBadge,
  FaUser,
  FaBuilding,
  FaInfoCircle,
  FaFileAlt,
} from "react-icons/fa";

export default function Admin_emp_tickets() {
  const [ticketsData, setTicketsData] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAssignTicketId, setSelectedAssignTicketId] = useState(null);

  const [isFlipping, setIsFlipping] = useState(false);

  const fetchTickets = () => {
    axios
      .get("/api/admin/employees/tickets")
      .then((response) => {
        if (response.data.status === "success") {
          setTicketsData(response.data.data);
          setErrorMsg("");
        } else {
          setErrorMsg(response.data.message || "Something went wrong");
        }
      })
      .catch(() => setErrorMsg("Failed to fetch employee tickets"));
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const departmentOptions = [
    "ALL",
    "IT Support",
    "Non It Support",
    "HR & Finance Support",
  ];

  const allTickets = ticketsData.flatMap((emp) =>
    emp.tickets.map((ticket) => ({
      ...ticket,
      employeeName: emp.name,
      assignedToDepartmentName: ticket.assignedToDepartmentName || "Unassigned",
    }))
  );

  const filteredTickets = allTickets
    .filter(
      (ticket) => statusFilter === "ALL" || ticket.status === statusFilter
    )
    .filter(
      (ticket) =>
        departmentFilter === "ALL" ||
        ticket.assignedToDepartmentName === departmentFilter
    )
    .filter((ticket) => {
      if (!searchTerm) return true;
      const lower = searchTerm.toLowerCase();
      return (
        ticket.employeeName.toLowerCase().includes(lower) ||
        ticket.ticketId.toString().includes(lower) ||
        ticket.title.toLowerCase().includes(lower)
      );
    });

  useEffect(() => {
    if (
      selectedTicket &&
      !filteredTickets.find((t) => t.ticketId === selectedTicket.ticketId)
    ) {
      setSelectedTicket(null);
    }
  }, [filteredTickets, selectedTicket]);

  useEffect(() => {
    if (selectedTicket) {
      setIsFlipping(true);
    }
  }, [selectedTicket]);

  const openCancelModal = (ticketId) => {
    setSelectedTicketId(ticketId);
    setShowCancelModal(true);
  };
  const closeCancelModal = () => setShowCancelModal(false);

  const openAssignModal = (ticketId) => {
    setSelectedAssignTicketId(ticketId);
    setShowAssignModal(true);
  };
  const closeAssignModal = () => setShowAssignModal(false);

  return (
    <AdminLayout>
      <div className="container fade-in">
        <h1 className="main-heading">Employee Tickets</h1>

        <div className="filter-controls">
          <input
            type="text"
            className="search-input"
            placeholder="Search by Employee, Ticket ID or Title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="filter-group">
            <label htmlFor="departmentFilter" className="filter-label">
              Department
            </label>
            <select
              id="departmentFilter"
              className="department-filter"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              {departmentOptions.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="statusFilter" className="filter-label">
              Status
            </label>
            <select
              id="statusFilter"
              className="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {[
                "ALL",
                "RAISED",
                "ASSIGNED",
                "STARTED",
                "IN_PROGRESS",
                "ISSUE_RESOLVED",
                "CLOSED",
                "CANCELLED",
              ].map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          className="tickets-container"
          role="region"
          aria-live="polite"
          aria-atomic="true"
        >
          <div
            className="ticket-list"
            role="list"
            tabIndex={0}
            aria-label="Employee tickets list"
          >
            {errorMsg && <p className="no-tickets">{errorMsg}</p>}
            {!errorMsg && filteredTickets.length === 0 && (
              <p className="no-tickets">No tickets found matching criteria</p>
            )}
            {!errorMsg &&
              filteredTickets.map((ticket) => (
                <div
                  key={ticket.ticketId}
                  tabIndex={0}
                  role="listitem"
                  aria-selected={selectedTicket?.ticketId === ticket.ticketId}
                  className={`ticket-list-item ${
                    selectedTicket?.ticketId === ticket.ticketId
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => setSelectedTicket(ticket)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedTicket(ticket);
                      e.preventDefault();
                    }
                  }}
                >
                  {ticket.ticketId} - {ticket.title}
                </div>
              ))}
          </div>
          <div
            className={`ticket-detail-panel ${isFlipping ? "flip-in" : ""}`}
            role="region"
            aria-live="polite"
            aria-atomic="true"
            onAnimationEnd={() => setIsFlipping(false)}
          >
            {!selectedTicket && (
              <p className="no-selection">Select a ticket to see details</p>
            )}
            {selectedTicket && (
              <div className="detail-card">
                {/* Title */}
                <h2 className="detail-title">{selectedTicket.title}</h2>

                {/* Employee Name */}
                <div className="detail-row">
                  <span className="label">
                    <FaUser /> Employee:
                  </span>
                  <span className="value">{selectedTicket.employeeName}</span>
                </div>

                {/* Description */}
                <div className="detail-row">
                  <span className="label">
                    <FaFileAlt /> Description:
                  </span>
                  <span className="value">{selectedTicket.description}</span>
                </div>

                {/* Department */}
                <div className="detail-row">
                  <span className="label">
                    <FaBuilding /> Department:
                  </span>
                  <span className="value">
                    {selectedTicket.assignedToDepartmentName || "Unassigned"}
                  </span>
                </div>

                {/* Status */}
                <div className="detail-row">
                  <span className="label">
                    <FaInfoCircle /> Status:
                  </span>
                  <span className="value">
                    {selectedTicket.status.replace(/_/g, " ")}
                  </span>
                </div>

                {/* Created At */}
                <div className="detail-row">
                  <span className="label">🗓️ Created At:</span>
                  <span className="value">
                    {new Date(selectedTicket.createdAt).toLocaleString()}
                  </span>
                </div>

                {/* Updated At */}
                <div className="detail-row">
                  <span className="label">🔄 Updated At:</span>
                  <span className="value">
                    {new Date(selectedTicket.updatedAt).toLocaleString()}
                  </span>
                </div>

                

                {/* Cancel Reason */}
                {selectedTicket.cancelReason && (
                  <div className="detail-row">
                    <span className="label">❌ Cancel Reason:</span>
                    <span className="value">{selectedTicket.cancelReason}</span>
                  </div>
                )}

                {/* Close Reason */}
                {selectedTicket.closeReason && (
                  <div className="detail-row">
                    <span className="label">✅ Close Reason:</span>
                    <span className="value">{selectedTicket.closeReason}</span>
                  </div>
                )}

                <div className="action-buttons">
                  {/* The conditional rendering for action buttons remains the same as your current code. */}
                  {selectedTicket.status === "RAISED" ||
                  selectedTicket.status === "ASSIGNED" ||
                  selectedTicket.status === "STARTED" ? (
                    <>
                      <button
                        className="btn btn-primary"
                        onClick={() => openAssignModal(selectedTicket.ticketId)}
                      >
                        Assign
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => openCancelModal(selectedTicket.ticketId)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <p className="no-actions-text">No actions available</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCancelModal && (
        <Admin_cancel
          ticketId={selectedTicketId}
          onClose={closeCancelModal}
          onTicketCancelled={() => {
            fetchTickets();
            setSelectedTicket(null);
            closeCancelModal();
          }}
        />
      )}

      {showAssignModal && (
        <Admin_assign
          ticketId={selectedAssignTicketId}
          onClose={closeAssignModal}
          onTicketAssigned={() => {
            fetchTickets();
            setSelectedTicket(null);
            closeAssignModal();
          }}
        />
      )}
    </AdminLayout>
  );
}
