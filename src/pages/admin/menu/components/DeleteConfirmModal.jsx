const DeleteConfirmModal = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show" />

      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title text-danger">
                Delete Item
              </h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <p className="mb-0">
                Are you sure you want to delete this item?
                <br />
                <strong>This action cannot be undone.</strong>
              </p>
            </div>

            <div className="modal-footer">
              <button className="btn btn-light" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={onConfirm}>
                Delete
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmModal;
