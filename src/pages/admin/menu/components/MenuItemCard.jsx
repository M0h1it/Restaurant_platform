const MenuItemCard = ({ item, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="card h-100">
      <img
        src={item.image || "/placeholder.png"}
        className="card-img-top"
        style={{ height: 160, objectFit: "cover" }}
        alt={item.name}
      />

      {/* STATUS BUTTON */}
      <button
        className={`btn btn-sm mt-2 ${
          item.status ? "btn-success" : "btn-secondary"
        }`}
        onClick={() => onToggleStatus(item)}
      >
        {item.status ? "Active" : "Inactive"}
      </button>

      <div className="card-body d-flex flex-column">
        <small className="text-muted">{item.category_name}</small>

        <div className="d-flex justify-content-between">
          <strong>{item.name}</strong>
          <span>₹{item.price}</span>
        </div>  

        <p className="small mt-2">{item.description}</p>

        <div className="mt-auto d-flex justify-content-between">
          <button
            className="btn btn-link p-0 text-primary"
            onClick={() => onEdit(item)}
          >
            Edit
          </button>

          <button
            className="btn btn-link p-0 text-danger"
            onClick={() => onDelete(item)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};


export default MenuItemCard;
