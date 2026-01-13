import { useState } from "react";
import CategoryList from "./components/CategoryList";
import MenuItemCard from "./components/MenuItemCard";
import AddCategoryModal from "./components/AddCategoryModal";
import AddItemModal from "./components/AddItemModal";
import EditItemModal from "./components/EditItemModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import { deleteMenuItem } from "../../../services/menu.service";
import { FaRepeat } from "react-icons/fa6";

const MenuItemsView = ({
  categories,
  items = [],
  setItems,
  setMode,
  setCategories,
}) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteCategory, setDeleteCategory] = useState(null);

  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter((i) => i.category === activeCategory);

  return (
    <>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">Menu Items</h6>

        <div className="d-flex flex-wrap gap-2">
          <button
            className="btn btn-outline-dark btn-sm"
            onClick={() => setShowAddCategory(true)}
          >
            + Add Category
          </button>

          <button
            className="btn btn-outline-dark btn-sm"
            onClick={() => setMode("image")}
          >
            <FaRepeat /> Switch to Image
          </button>
        </div>
      </div>

      <div className="row">
        {/* LEFT */}
        <div className="col-12 col-md-3 mb-3 mb-md-0">
          <CategoryList
            categories={categories}
            active={activeCategory}
            onSelect={setActiveCategory}
            onDeleteCategory={setDeleteCategory}
          />
        </div>

        {/* RIGHT */}
        <div className="col-12 col-md-9">
          <div className="d-flex flex-column flex-sm-row justify-content-between gap-2 mb-3">
            <h6 className="mb-0">{activeCategory}</h6>

            <button
              className="btn btn-outline-dark btn-sm"
              onClick={() => setShowAddItem(true)}
            >
              + Add Item
            </button>
          </div>

          <div className="row g-3">
            {filteredItems.map((item) => (
              <div key={item.id} className="col-md-4">
                <MenuItemCard
                  item={item}
                  onEdit={setEditItem}
                  onDelete={setDeleteItem}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ADD CATEGORY */}
      <AddCategoryModal
        show={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        setCategories={setCategories}
      />

      {/* ADD ITEM */}
      <AddItemModal
        show={showAddItem}
        categories={categories}
        onClose={() => setShowAddItem(false)}
        onAdded={(item) => setItems((prev) => [...prev, item])}
      />

      {/* EDIT ITEM */}
      {editItem && (
        <EditItemModal
          show={true}
          item={editItem}
          categories={categories}
          onClose={() => setEditItem(null)}
          onUpdated={(updated) =>
            setItems((prev) =>
              prev.map((i) => (i.id === updated.id ? updated : i))
            )
          }
        />
      )}
      {/* Delete ITEM */}
      {deleteItem && (
        <DeleteConfirmModal
          show={true}
          onClose={() => setDeleteItem(null)}
          onConfirm={async () => {
            await deleteMenuItem(deleteItem.id);

            setItems((prev) => prev.filter((i) => i.id !== deleteItem.id));

            setDeleteItem(null);
          }}
        />
      )}
      {deleteCategory && (
        <DeleteConfirmModal
          show={true}
          onClose={() => setDeleteCategory(null)}
          onConfirm={async () => {
            // 🔥 API READY (later)
            // await deleteCategoryApi(deleteCategory.id);

            // Remove category from UI
            setCategories((prev) =>
              prev.filter((c) => c.id !== deleteCategory.id)
            );

            // Optional: reset active category
            setActiveCategory("All");

            setDeleteCategory(null);
          }}
        />
      )}
    </>
  );
};

export default MenuItemsView;
