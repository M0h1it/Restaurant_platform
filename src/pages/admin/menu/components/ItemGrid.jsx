import MenuItemCard from "./MenuItemCard";

const ItemGrid = ({ items, onEdit }) => {
  if (!items.length)
    return <p className="text-muted">No items found</p>;

  return (
    <div className="row g-3">
      {items.map(item => (
        <div key={item.id} className="col-md-4">
          <MenuItemCard item={item} onEdit={onEdit} />
        </div>
      ))}
    </div>
  );
};

export default ItemGrid;
