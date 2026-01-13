import MenuHeader from "../components/MenuHeader";
import BottomNav from "../components/BottomNav";
import StatusLegend from "../components/StatusLegend";
import TableGrid from "../components/TableGrid";
import { AUTH_USER_KEY } from "../../../constants/authKeys";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [showLegend, setShowLegend] = useState(false);

  return (
    <div className="bg-light d-flex flex-column" style={{ height: "100vh" }}>
      
      {/* HEADER */}
      <MenuHeader
        onLogOut={() => {
          localStorage.removeItem(AUTH_USER_KEY);
          navigate("/");
        }}
        onToggleLegend={() => setShowLegend((prev) => !prev)}
      />

      {/* LEGEND */}
      {showLegend && (
        <div className="px-3 pt-2">
          <StatusLegend />
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="px-3 pt-3 flex-grow-1 overflow-auto pb-5 mb-5">
        {/* Removed duplicate title: MenuHeader already shows "My Tables" */}
        <TableGrid />
      </div>

      {/* BOTTOM NAV */}
      <BottomNav hasNotification={true} />
    </div>
  );
}
