import { FaTrash } from "react-icons/fa";

const CategoryList = ({
  categories = [],
  active,
  onSelect,
  onDeleteCategory,
}) => {
  return (
    <div className="bg-light border rounded p-3">
      <h6 className="fw-semibold mb-3">Categories</h6>

      <ul className="list-unstyled mb-0">
        {/* ALL ITEMS */}
        <li
          className={`pb-2 mb-2 border-bottom d-flex justify-content-between align-items-center ${
            active === "All"
              ? "text-danger fw-semibold border-danger"
              : "text-dark"
          }`}
          role="button"
          onClick={() => onSelect("All")}
        >
          <span>All Items</span>
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
            role="button"
            onClick={() => onSelect(cat.name)}
          >
            {/* LEFT: NAME */}
            <span className="text-truncate">{cat.name}</span>

            {/* RIGHT: DELETE */}
            <button
              className="btn btn-sm btn-link text-danger p-0"
              onClick={(e) => {
                e.stopPropagation(); // 🔥 VERY IMPORTANT
                onDeleteCategory(cat);
              }}
            >
              <FaTrash size={12} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
