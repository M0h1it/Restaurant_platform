import { useState } from "react";
import { updateMenuItem } from "../../../../services/menu.service";

const EditItemModal = ({
  show,
  item,
  categories = [],
  onClose,
  onUpdated,
}) => {
  const [name, setName] = useState(item?.name || "");
  const [price, setPrice] = useState(item?.price || "");
  const [description, setDescription] = useState(item?.description || "");
  const [secondary, setSecondary] = useState(item?.secondary || "");
  const [type, setType] = useState(item?.type || "veg");
  const [category, setCategory] = useState(item?.category || "");
  const [preview, setPreview] = useState(item?.image || null);

  if (!show || !item) return null;

  const handleReplaceImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setPreview(null);
  };

  const handleSave = async () => {
    const updatedData = {
      name,
      price,
      description,
      secondary,
      type,
      category,
      image: preview,
    };

    const res = await updateMenuItem(item.id, updatedData);
    onUpdated({ ...item, ...updatedData });

    onClose();
  };

  return (
    <>
      {/* BACKDROP */}
      <div className="modal-backdrop fade show" />

      {/* MODAL */}
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">

            {/* HEADER */}
            <div className="modal-header">
              <h5 className="modal-title">Edit Menu Item</h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            {/* BODY */}
            <div className="modal-body">
              <div className="row g-3">

                {/* NAME */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Item Name</label>
                  <input
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* PRICE */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                {/* DESCRIPTION */}
                <div className="col-12">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* SECONDARY */}
                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Secondary Description
                  </label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={secondary}
                    onChange={(e) => setSecondary(e.target.value)}
                  />
                </div>

                {/* TYPE */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Type</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        checked={type === "veg"}
                        onChange={() => setType("veg")}
                      />
                      <label className="form-check-label">Veg</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        checked={type === "nonveg"}
                        onChange={() => setType("nonveg")}
                      />
                      <label className="form-check-label">Non-Veg</label>
                    </div>
                  </div>
                </div>

                {/* CATEGORY */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Category</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* IMAGE */}
                <div className="col-12">
                  <label className="form-label fw-semibold">Item Image</label>

                  {preview && (
                    <div className="mb-2">
                      <img
                        src={preview}
                        alt="preview"
                        className="rounded border"
                        style={{
                          width: 120,
                          height: 120,
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}

                  <div className="d-flex gap-2">
                    <label className="btn btn-outline-secondary btn-sm">
                      Replace
                      <input
                        type="file"
                        hidden
                        onChange={handleReplaceImage}
                      />
                    </label>

                    {preview && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={handleRemoveImage}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button className="btn btn-light" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleSave}>
                Update Item
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default EditItemModal;
