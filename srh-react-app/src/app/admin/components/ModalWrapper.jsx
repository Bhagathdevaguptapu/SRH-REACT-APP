import React from "react";
import "./ModalWrapper.css"; // style below

export default function ModalWrapper({ show, onClose, children }) {
  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content-box">
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
