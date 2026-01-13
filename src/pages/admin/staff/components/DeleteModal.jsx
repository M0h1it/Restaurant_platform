import { FaExclamationTriangle, FaTrashAlt } from "react-icons/fa";

const DeleteModal = ({ userName, onCancel, onConfirm }) => {
  return (
    <div
      className="modal fade show d-block bg-dark bg-opacity-50 transition-all"
      style={{ backdropFilter: "blur(4px)", zIndex: 1100 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          {/* HEADER WITH WARNING ICON */}
          {/* <div className="modal-header bg-warning-subtle border-0 py-3 justify-content-center">
            <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: 60, height: 60 }}>
              <FaExclamationTriangle size={30} />
            </div>
          </div> */}

          <div className="modal-body text-center p-4">
            <h5 className="fw-bold text-dark">Confirm Deletion</h5>
            <p className="text-muted mb-0">
              Are you sure you want to remove <strong>{userName}</strong> from
              the system?
            </p>
            {/* <p className="text-danger small fw-bold mt-2">
              This action cannot be undone.
            </p> */}
          </div>

          {/* ACTIONS */}
          <div className="modal-footer border-0 p-3 bg-light d-flex gap-2">
            <button
              className="btn btn-light fw-bold flex-grow-1 py-2 rounded-3"
              onClick={onCancel}
            >
              No, Keep User
            </button>
            <button
              className="btn btn-danger fw-bold flex-grow-1 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2"
              onClick={onConfirm}
            >
              <FaTrashAlt size={14} /> Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
