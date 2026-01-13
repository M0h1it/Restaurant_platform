import { useState } from "react";
import { addMenuItem } from "../../../../services/menu.service";

const AddItemModal = ({ show, onClose, categories = [], onAdded }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [secondary, setSecondary] = useState("");
  const [type, setType] = useState("veg");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  if (!show) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(file);
      setPreview(reader.result); // ✅ base64 string
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!name || !price || !category) return;

    const newItem = {
      name,
      price,
      description,
      secondary,
      type,
      category,
      image: preview, // local preview for now
    };

    const res = await addMenuItem(newItem);
    onAdded(res.data);

    // reset
    setName("");
    setPrice("");
    setDescription("");
    setSecondary("");
    setType("veg");
    setCategory("");
    setImage(null);
    setPreview(null);

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
              <h5 className="modal-title">Add Menu Item</h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            {/* BODY */}
            <div className="modal-body">
              <div className="row g-2">
                {/* ITEM NAME */}
                <div className="col-md-12">
                  <label className="form-label fw-semibold">Item Name</label>
                  <input
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* PRICE */}
                <div className="col-md-12">
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

                {/* SECONDARY DESCRIPTION */}
                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Secondary Description
                  </label>
                  <textarea
                    className="form-control"
                    rows={1}
                    value={secondary}
                    onChange={(e) => setSecondary(e.target.value)}
                  />
                </div>

                {/* TYPE */}
                <div className="col-md-12">
                  <label className="form-label fw-semibold">Type</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        checked={type === "veg"}
                        onChange={() => setType("veg")}
                      />
                      <label className="form-check-label">Veg</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
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
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImageChange}
                  />

                  {preview && (
                    <img
                      src={preview}
                      alt="preview"
                      className="mt-2 rounded border"
                      style={{ width: 120, height: 120, objectFit: "cover" }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button className="btn btn-light" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleSave}>
                Save Item
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddItemModal;
