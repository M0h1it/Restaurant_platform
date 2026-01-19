import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { updateCategory } from "../../../../services/menu.service";

const CategoryList = ({
  categories = [],
  active,
  onSelect,
  onDeleteCategory,
  onCategoryUpdated, // 🔥 NEW
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditValue(cat.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const saveEdit = async (cat) => {
    if (!editValue.trim()) return;

    try {
      await updateCategory(cat.id, {
        category_name: editValue.trim(),
        description: cat.description,
        status: cat.status,
      });

      onCategoryUpdated({
        ...cat,
        name: editValue.trim(), // UI normalized field
      });

      cancelEdit();
    } catch (err) {
      console.error(err);
      alert("Failed to update category");
    }
  };

  return (
    <div className="bg-light border rounded p-3">
      <h6 className="fw-semibold mb-3">Categories</h6>

      <ul className="list-unstyled mb-0">
        {/* ALL ITEMS */}
        <li
          className={`pb-2 mb-2 border-bottom ${
            active === "All"
              ? "text-danger fw-semibold border-danger"
              : "text-dark"
          }`}
          role="button"
          onClick={() => onSelect("All")}
        >
          All Items
        </li>

        {/* DYNAMIC CATEGORIES */}
        {categories.map((cat) => (
          <li
            key={cat.id}
            className={`pb-2 mb-2 border-bottom d-flex justify-content-between align-items-center ${
              active === cat.name
                ? "text-danger fw-semibold border-danger"
                : "text-dark"
            }`}
          >
            {/* LEFT */}
            {editingId === cat.id ? (
              <input
                className="form-control form-control-sm me-2"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                autoFocus
              />
            ) : (
              <span
                className="text-truncate"
                role="button"
                onClick={() => onSelect(cat.name)}
              >
                {cat.name}
              </span>
            )}

            {/* RIGHT ACTIONS */}
            <div className="d-flex gap-2">
              {editingId === cat.id ? (
                <>
                  <button
                    className="btn btn-sm btn-link text-success p-0"
                    onClick={() => saveEdit(cat)}
                  >
                    <FaCheck size={12} />
                  </button>
                  <button
                    className="btn btn-sm btn-link text-secondary p-0"
                    onClick={cancelEdit}
                  >
                    <FaTimes size={12} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-sm btn-link text-primary p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit(cat);
                    }}
                  >
                    <FaEdit size={12} />
                  </button>

                  <button
                    className="btn btn-sm btn-link text-danger p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCategory(cat);
                    }}
                  >
                    <FaTrash size={12} />
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
