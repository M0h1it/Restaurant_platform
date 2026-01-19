import { useState } from "react";
import { addCategory } from "../../../../services/menu.service";

const AddCategoryModal = ({ show, onClose, setCategories }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleSave = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);

      const newCategory = await addCategory({
        category_name: name.trim(),
        description: description.trim(),
      });

      // 🔥 Update UI
      setCategories((prev) => [...prev, newCategory]);

      setName("");
      setDescription("");
      onClose();
    } catch (err) {
      alert("Failed to add category");
      console.error(err);
    } finally {
      setLoading(false);
    }
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
                disabled={loading}
              />
            </div>

            {/* BODY */}
            <div className="modal-body">
              {/* CATEGORY NAME */}
              <label className="form-label fw-semibold">Category Name</label>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="e.g. Beverages"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />

              {/* DESCRIPTION */}
              <label className="form-label fw-semibold">Description</label>
              <textarea
                className="form-control"
                placeholder="e.g. Cold & hot drinks"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button
                className="btn btn-light"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleSave}
                disabled={loading || !name.trim()}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCategoryModal;
