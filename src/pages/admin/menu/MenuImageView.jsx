import { useState } from "react";
import UploadMenuModal from "./components/UploadMenuModal";
import MenuImageCard from "./components/MenuImageCard";

const MenuImageView = ({ images, setImages, setMode }) => {
  const [showUpload, setShowUpload] = useState(false);

  const handleImageUpdate = (updated) => {
    setImages((prev) =>
      prev.map((img) => (img.id === updated.id ? updated : img))
    );
  };

  const handleImageDelete = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  return (
    <>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">Menu Images</h6>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-dark btn-sm"
            onClick={() => setShowUpload(true)}
          >
            + Upload Menu
          </button>

          <button
            className="btn btn-outline-dark btn-sm"
            onClick={() => setMode("items")}
          >
            Switch to Category
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="row g-4">
        {images.map((img) => (
          <div key={img.id} className="col-lg-4 col-md-6">
            <MenuImageCard
              image={img}
              onUpdated={handleImageUpdate}
              onDeleted={handleImageDelete}
            />
          </div>
        ))}
      </div>

      {showUpload && (
        <UploadMenuModal
          onClose={() => setShowUpload(false)}
          onUploaded={(img) => setImages((prev) => [...prev, img])}
        />
      )}
    </>
  );
};

export default MenuImageView;
