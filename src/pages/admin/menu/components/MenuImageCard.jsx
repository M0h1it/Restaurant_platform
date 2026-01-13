import { useRef } from "react";
import {
  deleteMenuImage,
  replaceMenuImage,
} from "../../../../services/menu.service";

const MenuImageCard = ({ image, onUpdated, onDeleted }) => {
  const fileRef = useRef();

  const handleReplace = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const res = await replaceMenuImage(image.id, file);
    onUpdated(res.data);
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this menu image?")) return;

    await deleteMenuImage(image.id);
    onDeleted(image.id);
  };

  return (
    <div className="border rounded p-2 h-100 d-flex flex-column">

      {/* IMAGE */}
      <div className="rounded mb-2  d-flex align-items-center justify-content-center"
           style={{ height: 260 }}>
        <img
          src={image.url}
          alt={image.name}
          className="img-fluid"
          style={{ maxHeight: "100%", objectFit: "contain" }}
        />
      </div>

      {/* FOOTER */}
      <div className="d-flex justify-content-between align-items-center mt-auto">
        <small className="text-muted">{image.name}</small>

        <div className="dropdown">
          <button
            className="btn btn-lg btn-light fw-bold"
            data-bs-toggle="dropdown"
          >
            ...
          </button>

          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <label className="dropdown-item">
                Replace Image
                <input
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleReplace}
                />
              </label>
            </li>
            <li>
              <button
                className="dropdown-item text-danger"
                onClick={handleDelete}
              >
                Delete Image
              </button>
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
};

export default MenuImageCard;
