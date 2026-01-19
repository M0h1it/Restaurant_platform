import MenuHeader from "../components/MenuHeader";
import BottomNav from "../components/BottomNav";
import { useEffect, useState } from "react";
import { WaiterAPI } from "../../../api/waiter.api";
import { FaPhoneAlt, FaReceipt } from "react-icons/fa";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
  WaiterAPI.getNotifications().then(setNotifications);
}, []);


  const clearNotification = async (id) => {
    await WaiterAPI.resolveRequest(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="bg-light d-flex flex-column" style={{ height: "100vh" }}>
      {/* Header */}
      <MenuHeader onLogOut={() => {}} onToggleLegend={() => {}} />

      {/* Content */}
      <div className="px-3 py-3 flex-grow-1 overflow-auto">
        {notifications.length === 0 ? (
          <div className="text-center fw-bold mt-5 text-secondary">
            No new notifications
          </div>
        ) : (
          notifications.map((item) => (
            <NotificationCard
              key={item.id}
              data={item}
              onClear={() => clearNotification(item.id)}
            />
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav hasNotification={notifications.length > 0} />
    </div>
  );
}

function NotificationCard({ data, onClear }) {
  return (
    <div className="notification-card d-flex justify-content-between align-items-center bg-white rounded-4 shadow-sm px-3 py-2 mb-3 border">
      <div className="d-flex flex-column">
        {/* Icon + Table */}
        <div className="d-flex align-items-center gap-2">
          {data.type === "query" ? (
            <FaPhoneAlt className="text-danger" size={18} />
          ) : (
            <FaReceipt className="text-danger" size={18} />
          )}
          <strong>{data.table}</strong>
        </div>

        {/* Message */}
        <small className="text-secondary">{data.message}</small>
      </div>

      {/* Done Button */}
      <button
        className="btn btn-danger fw-bold rounded-3 py-1 px-3 btn-sm"
        onClick={onClear}
      >
        Done
      </button>
    </div>
  );
}
