INSERT INTO srh.admin (ADMIN_ID, NAME) VALUES (1,'admin@123','adminpass')

INSERT INTO srh.department (DEPARTMENT_ID, NAME) VALUES
(1, 'IT'),
(2, 'NON_IT'),
(3, 'HR_FINANCE');

INSERT INTO srh.employee (EMPLOYEE_ID, NAME, EMAIL, PASSWORD) VALUES
(100, 'Alice Smith', 'alice@srh.com', 'password123'),
(101, 'Bob Jones', 'bob@srh.com', 'password456');


INSERT INTO srh.ticket (
    TICKET_ID, TITLE, DESCRIPTION, STATUS, CANCEL_REASON, CLOSE_REASON,
    CREATED_BY, ASSIGNED_TO_DEPARTMENT, CREATED_AT, UPDATED_AT
) VALUES (
    1000, 'Printer Issue', 'Printer not working in office', 'RAISED', NULL, NULL,
    100, 1, TIMESTAMP('2025-07-18 15:30:00'), TIMESTAMP('2025-07-18 15:30:00')
);

INSERT INTO srh.ticketcomment (
    COMMENT_ID, TICKET_ID, COMMENTER_ROLE, COMMENTER_NAME, COMMENT_TEXT, COMMENTED_AT
) VALUES (
    1, 1000, 'IT', 'John Doe', 'Please check cable connections.', TIMESTAMP('2025-07-18 15:30:00')
);

SELECT * FROM srh.TICKETCOMMENT;

INSERT INTO srh.ticketstatushistory (
    HISTORY_ID, TICKET_ID, STATUS, UPDATED_BY, UPDATED_AT
) VALUES (
    1, 1000, 'RAISED', 'Alice Smith', TIMESTAMP('2025-07-18 15:30:00')
);


INSERT INTO srh.ticketfeedback (
    FEEDBACK_ID, TICKET_ID, EMPLOYEE_ID, FEEDBACK_TEXT, GIVEN_AT
) VALUES (
    1, 1000, 100, 'Issue resolved quickly. Thank you!', TIMESTAMP('2025-07-18 15:30:00')
);