import { useState } from "react";
import { addCategory } from "../../../../services/menu.service";

const AddCategoryModal = ({ show, onClose, setCategories }) => {
  const [name, setName] = useState("");

  if (!show) return null;

  const handleSave = async () => {
    if (!name.trim()) return;

    try {
      const res = await addCategory(name);
      const newCategory = res.data?.data || res.data;

      setCategories((prev) => [...prev, newCategory]);
    } catch {
      // fallback (local only)
      const fakeCategory = {
        id: Date.now(),
        name,
      };
      setCategories((prev) => [...prev, fakeCategory]);
    }

    setName("");
    onClose();
  };

  return (
    <>
      {/* BACKDROP */}
      <div className="modal-backdrop fade show" />

      {/* MODAL */}
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            {/* HEADER */}
            <div className="modal-header">
              <h5 className="modal-title">Add Category</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              />
            </div>

            {/* BODY */}
            <div className="modal-body">
              <label className="form-label fw-semibold">
                Category Name
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button
                className="btn btn-light"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleSave}
              >
                Save
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default AddCategoryModal;
