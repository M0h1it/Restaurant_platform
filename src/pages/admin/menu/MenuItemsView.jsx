import { useState } from "react";
import CategoryList from "./components/CategoryList";
import { deleteCategoryApi } from "../../../services/menu.service";
import MenuItemCard from "./components/MenuItemCard";
import AddCategoryModal from "./components/AddCategoryModal";
import AddItemModal from "./components/AddItemModal";
import EditItemModal from "./components/EditItemModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import { updateMenuItem } from "../../../services/menu.service";
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

  const activeCategoryObj = categories.find((c) => c.name === activeCategory);
  const handleToggleStatus = async (item) => {
    const updated = {
      ...item,
      status: item.status ? 0 : 1,
    };

    await updateMenuItem(item.id, updated);

    setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
  };

  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter((i) => i.category_id === activeCategoryObj?.id);

  return (
    <>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">Menu Items</h6>

        <div className="d-flex gap-2">
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
            Switch to Image
          </button>
        </div>
      </div>

      <div className="row">
        {/* LEFT */}
        <div className="col-md-3">
          <CategoryList
            categories={categories}
            active={activeCategory}
            onSelect={setActiveCategory}
            onDeleteCategory={setDeleteCategory}
            onCategoryUpdated={(updated) => {
              setCategories((prev) =>
                prev.map((c) => (c.id === updated.id ? updated : c))
              );

              if (activeCategory === updated.oldName) {
                setActiveCategory(updated.name);
              }
            }}
          />
        </div>

        {/* RIGHT */}
        <div className="col-md-9">
          <div className="d-flex justify-content-between mb-3">
            <h6>{activeCategory}</h6>
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
                  onToggleStatus={handleToggleStatus}
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
          show
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

      {/* DELETE ITEM */}
      {deleteItem && (
        <DeleteConfirmModal
          show
          onClose={() => setDeleteItem(null)}
          onConfirm={async () => {
            await deleteMenuItem(deleteItem.id);
            setItems((prev) => prev.filter((i) => i.id !== deleteItem.id));
            setDeleteItem(null);
          }}
        />
      )}

      {/* DELETE CATEGORY */}
      {deleteCategory && (
        <DeleteConfirmModal
          show
          onClose={() => setDeleteCategory(null)}
          onConfirm={async () => {
            await deleteCategoryApi(deleteCategory.id);

            // 🔥 remove category
            setCategories((prev) =>
              prev.filter((c) => c.id !== deleteCategory.id)
            );

            // 🔥 remove items of this category
            setItems((prev) =>
              prev.filter((i) => i.category_id !== deleteCategory.id)
            );

            setActiveCategory("All");
            setDeleteCategory(null);
          }}
        />
      )}
    </>
  );
};

export default MenuItemsView;
