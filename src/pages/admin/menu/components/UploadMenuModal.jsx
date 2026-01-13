import { useState } from "react";
import { uploadMenuImage } from "../../../../services/menu.service";

const UploadMenuModal = ({ onClose, onUploaded }) => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [preview, setPreview] = useState(null);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    if (!file || !name.trim()) return;

    const res = await uploadMenuImage(file, name);
    onUploaded(res.data);
    onClose();
  };

  return (
    <>
      <div className="modal-backdrop fade show" />

      <div className="modal fade show d-block">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">Upload Menu Image</h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              {preview && (
                <img
                  src={preview}
                  className="img-fluid rounded mb-3"
                  style={{ maxHeight: 200, objectFit: "contain" }}
                />
              )}

              <input
                type="file"
                className="form-control mb-2"
                onChange={handleFile}
              />

              <input
                className="form-control fw-bold"
                placeholder="Menu image name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="modal-footer">
              <button className="btn btn-light" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                disabled={!file || !name}
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

export default UploadMenuModal;
