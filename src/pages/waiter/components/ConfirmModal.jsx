export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div
      className="
        modal 
        fade 
        show 
        d-block
      "
      tabIndex={-1}
      role="dialog"
      aria-labelledby="confirmModalLabel"
      aria-modal="true"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow">

          {/* Modal Body */}
          <div className="modal-body text-center">
            <p className="fw-bold mb-0">{message}</p>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer d-flex justify-content-center gap-2">
            <button type="button" className="btn btn-danger" onClick={onCancel}>
              No
            </button>
            <button type="button" className="btn btn-success" onClick={onConfirm}>
              Yes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
