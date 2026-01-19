import { useState } from "react";
import { uploadMenuImage } from "../../../../services/menu.service";

const UploadMenuModal = ({ onClose, onUploaded, categories = [] }) => {
  const [file, setFile] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!file || !categoryId) {
      alert("Please select category and image");
      return;
    }

    try {
      setLoading(true);

      const uploaded = await uploadMenuImage(file, Number(categoryId));

      onUploaded(uploaded);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show" />

      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            {/* HEADER */}
            <div className="modal-header">
              <h5 className="modal-title">Upload Menu Image</h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            {/* BODY */}
            <div className="modal-body">

              {/* CATEGORY */}
              <label className="form-label fw-semibold">
                Category
              </label>
              <select
                className="form-select mb-3"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* IMAGE */}
              <label className="form-label fw-semibold">
                Menu Image
              </label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setFile(e.target.files[0])}
              />

            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button className="btn btn-light" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                disabled={loading}
                onClick={handleSave}
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default UploadMenuModal;
